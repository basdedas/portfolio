"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="max-w-3xl mx-auto px-6 py-8 flex justify-end items-center gap-4">
      
      {/* 1. CV Button (On the Left) */}
      <a 
        href="/Bas_van_Dijk_CV.pdf" 
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 border border-zinc-800 rounded-full text-[10px] font-mono text-zinc-400 hover:text-white hover:border-zinc-500 transition-all uppercase tracking-widest"
      >
        [GET_CV_PDF]
      </a>

      {/* 2. Dynamic Auth Button (On the Right) */}
      {session ? (
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-[10px] font-mono text-zinc-500 hover:text-red-400 transition-all uppercase tracking-widest"
        >
          [SIGN_OUT]
        </button>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="px-4 py-2 text-[10px] font-mono text-blue-400 hover:text-blue-300 transition-all uppercase tracking-widest"
        >
          [SIGN_IN]
        </button>
      )}

    </header>
  );
}