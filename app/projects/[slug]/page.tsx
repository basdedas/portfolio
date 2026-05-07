import clientPromise from "@/app/lib/mongodb";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Comments from "@/app/components/Comments"; 

export default async function ProjectPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  const client = await clientPromise;
  const db = client.db("portfolio");
  const project = await db.collection("projects").findOne({ slug: slug });

  if (!project) notFound();

  // --- RESTORE GITHUB FETCH ---
let readmeContent = "";
  if (project.github) {
    try {
      const cleanRepoUrl = project.github.replace("https://github.com/", "").replace(/\/$/, "");
      
      // Attempt 1: Try 'main' branch
      const mainUrl = `https://raw.githubusercontent.com/${cleanRepoUrl}/main/README.md`;
      let response = await fetch(mainUrl, { cache: 'no-store' }); // Disable cache for testing

      // Attempt 2: Fallback to 'master' if 'main' fails
      if (!response.ok) {
        const masterUrl = `https://raw.githubusercontent.com/${cleanRepoUrl}/master/README.md`;
        response = await fetch(masterUrl, { cache: 'no-store' });
      }

      if (response.ok) {
        readmeContent = await response.text();
      }
    } catch (e) {
      console.error("GitHub fetch failed entirely");
    }
  }
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 md:p-24 selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/" className="text-zinc-500 hover:text-white mb-12 inline-block font-mono text-xs uppercase border-b border-transparent hover:border-zinc-500 transition-all">
          ← SYSTEM_BACK_CMD
        </Link>
        
        <header className="mb-16 border-b border-zinc-900 pb-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight italic text-blue-50 leading-tight">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {project.stack?.map((tech: string) => (
              <span key={tech} className="bg-blue-500/10 border border-blue-500/40 px-3 py-1 rounded text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* --- MARKDOWN CONTENT --- */}
        <article className="max-w-none mb-20">
          {readmeContent ? (
            <ReactMarkdown 
              components={{
                h1: ({...props}) => <h1 className="text-4xl font-bold text-white mb-6 mt-12 border-b border-zinc-800 pb-2" {...props} />,
                h2: ({...props}) => <h2 className="text-2xl font-semibold text-blue-100 mt-10 mb-4" {...props} />,
                p: ({...props}) => <p className="leading-relaxed mb-6 text-zinc-400 text-lg font-light" {...props} />,
                code: ({...props}) => <code className="bg-zinc-900 text-blue-300 px-1.5 py-0.5 rounded font-mono text-sm border border-zinc-800" {...props} />,
                pre: ({...props}) => (
                  <pre className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 overflow-x-auto my-8 shadow-2xl" {...props} />
                ),
              }}
            >
              {readmeContent}
            </ReactMarkdown>
          ) : (
            <p className="text-zinc-400 text-xl leading-relaxed">{project.desc}</p>
          )}
        </article>

        <div className="mb-32">
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <span>EXPLORE_REPOSITORY</span>
            <span className="group-hover:translate-x-1 transition-transform text-xs">↗</span>
          </a>
        </div>

        {/* --- COMMENTS SECTION --- */}
        <Comments projectId={project._id.toString()} />
      </div>
    </div>
  );
}