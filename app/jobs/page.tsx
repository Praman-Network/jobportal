// app/jobs/page.tsx
import { createClient } from "@/lib/supabase-server";
import { getExternalJobs } from "@/lib/external-jobs";
import JobCardList from "@/components/JobCardList";
import type { InternalJob, JobCardData } from "@/lib/types";
import { ShieldCheck, MapPin, Building2, Sparkles, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  let internalJobsRaw: InternalJob[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (data) {
      internalJobsRaw = data as InternalJob[];
    }
  } catch (err) {
    console.warn("Failed to query Supabase internal jobs:", err);
  }

  const externalJobs = await getExternalJobs();

  const internalJobs: JobCardData[] = internalJobsRaw.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    location: j.location || "Bangalore, India",
    tags: ["Verified", "Direct Posting"],
    applyUrl: j.apply_url,
    postedAt: j.created_at,
    origin: "internal",
    sourceName: "Verified Recruiter",
    description: j.description,
    jobType: j.title.toLowerCase().includes("intern") ? "Internship" : "Full-time",
    experienceLevel: "0-2 Years / Open",
    stipendOrSalary: "Competitive",
  }));

  const externalJobCards: JobCardData[] = externalJobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    location: j.location,
    tags: j.tags,
    applyUrl: j.applyUrl,
    postedAt: j.postedAt,
    origin: "external",
    sourceName: j.source,
    jobType: j.jobType || "Full-time",
    stipendOrSalary: j.stipendOrSalary,
    experienceLevel: j.experienceLevel,
    description: j.description,
  }));

  const allJobs = [...internalJobs, ...externalJobCards];

  return (
    <div className="relative min-h-screen bg-[#06060c] text-white">
      {/* Ambient background glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[560px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% -10%, rgba(0,240,255,0.12), rgba(120,50,255,0.04) 60%, transparent 80%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-24">
        {/* Top Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 items-start">
          {/* Hero copy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-xs tracking-wider uppercase font-semibold text-[#00F0FF] font-mono-brand shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
              🇮🇳 India Tech & Internship Board
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Find top <span className="text-[#00F0FF]">internships & jobs</span> in India,
              <br className="hidden sm:block" /> with zero dead links.
            </h1>

            <p className="text-zinc-400 text-sm sm:text-[15px] max-w-xl leading-relaxed">
              Curated opportunities across Bangalore, Gurgaon, Mumbai, Hyderabad, Pune, and India-Remote.
              Every listing connects directly to official company career pages.
            </p>

            {/* Quick city badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-400">
              <span className="font-mono-brand text-zinc-500 text-[11px] uppercase tracking-wider">Top Hubs:</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-zinc-300">📍 Bangalore</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-zinc-300">📍 Delhi NCR / Gurgaon</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-zinc-300">📍 Mumbai</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-zinc-300">📍 Hyderabad</span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-zinc-300">📍 Pune</span>
            </div>
          </div>

          {/* Unified Clean Coverage Metrics Panel */}
          <div className="rounded-2xl border border-white/10 bg-[#0b0c16]/90 backdrop-blur-xl p-5 shadow-xl">
            <div className="flex items-center justify-between font-mono-brand text-[10.5px] uppercase tracking-widest text-zinc-400 mb-4 pb-3 border-b border-white/5">
              <span>Platform Status</span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live & Verified
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs sm:text-[13px]">
                <span className="text-zinc-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" /> Active Indian Tech Roles
                </span>
                <span className="font-mono-brand text-[#00F0FF] font-bold">
                  {allJobs.length} Positions
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-[13px]">
                <span className="text-zinc-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Direct Career Portals
                </span>
                <span className="font-mono-brand text-purple-300 font-bold">
                  100% Direct Apply
                </span>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Redirect Policy</span>
                <span className="font-mono-brand text-zinc-300 text-[11px] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  Direct to Employer ↗
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings with interactive search & city filters */}
        <JobCardList jobs={allJobs} />
      </div>
    </div>
  );
}
