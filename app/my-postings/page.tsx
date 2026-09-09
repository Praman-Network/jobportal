// app/my-postings/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import type { InternalJob } from "@/lib/types";
import { ArrowUpRight, Trash2, Building2, MapPin, PlusCircle, ExternalLink } from "lucide-react";

export default function MyPostingsPage() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<InternalJob[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("recruiter_id", user.id)
      .order("created_at", { ascending: false });
    setJobs((data as InternalJob[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this job posting? This cannot be undone.")) {
      return;
    }
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="font-mono-brand text-[11px] tracking-widest uppercase text-[#00F0FF] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
            Recruiter Dashboard
          </div>
          <h1 className="font-display text-3xl font-bold text-white">My Postings</h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Manage your active job postings and view live candidate application links.
          </p>
        </div>
        <Link href="/post-job" className="btn-primary shrink-0 flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Post a Job
        </Link>
      </div>

      {loading ? (
        <div className="glass-panel p-12 text-center text-zinc-400 text-sm">
          Loading your postings...
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-14 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">No active postings yet</h3>
          <p className="text-zinc-400 text-sm max-w-sm mx-auto">
            You haven&apos;t posted any jobs yet. Post a role to have it featured on the main board.
          </p>
          <Link href="/post-job" className="btn-primary inline-flex">
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-white/10 bg-[#0d0f1a]/80 backdrop-blur-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-all"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-bold text-base text-white hover:text-[#00F0FF] transition-colors">
                    {job.title}
                  </h3>
                  <span className="font-mono-brand text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    Live on Board
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-[#00F0FF]" /> {job.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> {job.location}
                  </span>
                  <span className="font-mono-brand text-zinc-500">
                    Posted {new Date(job.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                {job.description && (
                  <p className="text-zinc-400 text-xs line-clamp-1 pt-1 font-sans">
                    {job.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-display font-semibold uppercase tracking-wider px-3.5 py-2 rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF] hover:bg-[#00F0FF] hover:text-[#001014] transition-all"
                >
                  Open Job <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleDelete(job.id)}
                  className="inline-flex items-center gap-1 text-xs font-mono-brand text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 px-3 py-2 rounded-xl transition-colors"
                  title="Delete job posting"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
