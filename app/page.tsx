'use client';

import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Projects
  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((projects) => {
        setData(projects);
        setLoading(false);
      });
  }, []);
    const handleLike = async (projectId: string) => { // <--- Add projectId here
      if (!session) {
        alert("Please sign in to like projects!");
        return;
      }

      const res = await fetch("/api/projects/like", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' }, // Good practice to add this
        body: JSON.stringify({ projectId: projectId }), // <--- Use the input here
      });

    const result = await res.json();

    if (res.status === 200 && result.message === "Already liked!") {
      alert("You've already liked this one! Thanks for the support though.");
      return;
    }

    if (res.ok) {
      // 3. Update the UI locally so it changes immediately
      setData((prevData) =>
        prevData.map((p) =>
          p._id === projectId ? { ...p, likes: (p.likes || 0) + 1 } : p
        )
      );
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Connecting...</div>;

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* LOGIN HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-zinc-400 text-nowrap overflow-hidden">
              {session ? `Logged in as ${session.user?.name}` : "System Live: Cloud Verified"}
            </span>
          </div>
          
          {session ? (
            <button onClick={() => signOut()} className="text-xs text-zinc-500 hover:text-white transition-colors">Sign Out</button>
          ) : (
            <button onClick={() => signIn('google')} className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-zinc-200 transition-all">
              Sign in with Google to like and comment
            </button>
          )}
        </div>

        <h1 className="text-6xl font-bold tracking-tight mb-4">
          Bas van Dijk<span className="text-blue-500">_</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {data.map((project) => (
            <div key={project._id} className="group relative p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50">
              <div className="relative z-10">
                <Link href={`/projects/${project.slug}`}>
                  <h3 className="text-2xl font-bold mb-3 hover:text-blue-400 transition-colors cursor-pointer">
                    {project.title}
                  </h3>
                </Link>                
                <p className="text-zinc-400 mb-8 text-sm leading-relaxed">{project.desc}</p>
                <button 
                  onClick={() => handleLike(project._id)}
                  className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-xl transition-colors border border-zinc-700/30 ${
                    !session 
                      ? 'opacity-50 cursor-not-allowed bg-zinc-900' 
                      : 'bg-zinc-800/50 hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-red-500">❤️</span>
                  <span className="text-sm font-mono">{project.likes || 0}</span>
                </button>
                
                <div className="flex gap-2">
                  {project.stack?.map((tech: string) => (
                    <span key={tech} className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold bg-zinc-800/30 px-2 py-1 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}