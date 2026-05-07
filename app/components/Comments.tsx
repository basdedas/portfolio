"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";

export default function Comments({ projectId }: { projectId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Comments
  useEffect(() => {
    fetch(`/api/comments?projectId=${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Comments:", data); // Check console to see if 'email' exists
        setComments(data);
      })
      .catch((err) => console.error("Error fetching comments:", err));
  }, [projectId]);

  // 2. Post Comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, text }),
    });

    if (res.ok) {
      const newComment = await res.json();
      // Ensure we add the new comment to the list immediately
      setComments([newComment, ...comments]);
      setText("");
    }
    setIsSubmitting(false);
  };

  // 3. Delete Comment
  const handleDelete = async (commentId: string) => {
    if (!commentId) {
      alert("Error: Comment ID missing.");
      return;
    }
    if (!confirm("Delete this comment permanently?")) return;

    const res = await fetch("/api/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });

    if (res.ok) {
      setComments(comments.filter((c) => (c._id || c.id) !== commentId));
    } else {
      const errData = await res.json();
      alert(`Error: ${errData.error || "Could not delete"}`);
    }
  };

  return (
    <div className="mt-16 border-t border-zinc-900 pt-10 pb-20 font-sans">
      <h3 className="text-2xl font-bold mb-8 text-white italic tracking-tight">
        Project_Feedback
      </h3>

      {/* Input Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-12">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
            placeholder="Write a technical note..."
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-2 rounded-full text-xs font-bold font-mono transition-all uppercase tracking-widest"
            >
              {isSubmitting ? "SYNCING..." : "POST_COMMENT"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-8 text-center mb-12">
          <p className="text-zinc-500 text-sm mb-4 font-mono">AUTH_REQUIRED_TO_POST</p>
          <button
            onClick={() => signIn("google")}
            className="text-blue-400 hover:text-blue-300 font-bold text-sm underline underline-offset-4 transition-all"
          >
            Sign_in_with_Google
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-8">
        {comments.length > 0 ? (
          comments.map((c) => {
            const commentId = c._id || c.id;
            const isOwner = session?.user?.email && c.email && session.user.email === c.email;

            return (
              <div key={commentId} className="flex gap-5 items-start">
                {/* Profile Image */}
                <div className="relative h-10 w-10 shrink-0">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.user || "User"}
                      fill
                      className="rounded-full border border-zinc-800 object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 text-xs font-mono">
                      {c.user?.charAt(0) || "?"}
                    </div>
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="text-sm font-bold text-zinc-200">
                      {c.user}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {/* --- DELETE BUTTON LOGIC --- */}
                      {isOwner ? (
                        <button
                          onClick={() => handleDelete(commentId)}
                          className="text-[10px] font-mono text-red-500/60 hover:text-red-500 transition-all uppercase border border-red-500/20 px-2 py-0.5 rounded bg-red-500/5"
                        >
                          [DELETE_RECORD]
                        </button>
                      ) : (
                        /* DEBUG SPANS - DELETE THESE AFTER TESTING */
                        <div className="flex gap-1">
                          {!c.email && <span className="text-[7px] text-zinc-800 font-mono">ERR_NO_DB_EMAIL</span>}
                          {!session && <span className="text-[7px] text-zinc-800 font-mono">ERR_NO_SESSION</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                    {c.text}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-zinc-600 font-mono text-xs italic">No_feedback_entries_found.</p>
        )}
      </div>
    </div>
  );
}