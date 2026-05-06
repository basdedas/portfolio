import clientPromise from "@/app/lib/db";

// No more fetch()! We talk to the DB directly.
async function getProjects() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    const projects = await db.collection("projects").find({}).toArray();
    
    // MongoDB objects have a special _id, we convert it to a string for React
    return projects.map(project => ({
      ...project,
      _id: project._id.toString(),
    }));
  } catch (e) {
    console.error("Database error:", e);
    return [];
  }
}

export default async function Home() {
  const data = await getProjects();

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-400">System Live: MongoDB Connected</span>
        </div>

        <h1 className="text-6xl font-bold tracking-tight mb-4">
          Full Stack Dev<span className="text-blue-500">_</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {data.length > 0 ? data.map((project: any) => (
            <div key={project._id} className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800">
              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              <p className="text-zinc-400 mb-6 text-sm">{project.desc}</p>
              <div className="flex flex-wrap gap-2">
                {project.stack?.map((tech: string) => (
                  <span key={tech} className="px-2 py-1 text-[10px] font-bold bg-zinc-800 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )) : (
            <p className="text-zinc-500">No projects found in database.</p>
          )}
        </div>
      </div>
    </main>
  );
}