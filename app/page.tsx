import projects from './lib/projects.json'; // 1. Import the data

async function getData() {
  const res = await fetch('http://localhost:3000/api/hello', { cache: 'no-store' });
  return res.json();
}

export default async function Home() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* API Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-400">
            Backend Status: {data.message}
          </span>
        </div>

        <h1 className="text-6xl font-bold tracking-tight mb-4">
          Full Stack Dev<span className="text-blue-500">_</span>
        </h1>
        <p className="text-zinc-400 text-xl mb-16 max-w-xl">
          Building scalable cloud infrastructure and modern web experiences.
        </p>

        {/* 2. The Projects Grid */}
        <h2 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-6">Selected Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="group p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all">
              <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                {project.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="px-2 py-1 text-[10px] font-bold bg-zinc-800 rounded text-zinc-300 uppercase">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}