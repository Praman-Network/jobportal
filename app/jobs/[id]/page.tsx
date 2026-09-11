import { createClient } from "@/lib/supabase-server";
import { getExternalJobs } from "@/lib/external-jobs";
import JobCardList from "@/components/JobCardList";
import type { InternalJob, JobCardData } from "@/lib/types";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

async function fetchAllJobs(): Promise<{ allJobs: JobCardData[], isLoggedIn: boolean }> {
  let internalJobsRaw: InternalJob[] = [];
  let isLoggedIn = false;

  try {
    const supabase = await createClient();
    
    // Check auth status
    const { data: authData } = await supabase.auth.getUser();
    isLoggedIn = !!authData?.user;

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
  return { allJobs, isLoggedIn };
}

// Generate Dynamic Metadata for the Job
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { allJobs } = await fetchAllJobs();
  const job = allJobs.find(j => j.id === params.id);

  if (!job) {
    // Fallback parsing for expired jobs
    const isArbeitnow = params.id.startsWith('arbeitnow-');
    let fallbackTitle = isArbeitnow ? params.id.replace('arbeitnow-', '').split('-').slice(0, 4).join(' ') : 'Tech Role';
    fallbackTitle = fallbackTitle.charAt(0).toUpperCase() + fallbackTitle.slice(1);
    const fallbackCompany = params.id.includes('gh-') ? params.id.split('-')[1] : (params.id.includes('lever-') ? params.id.split('-')[1] : 'Company');

    return {
      title: `${fallbackTitle} at ${fallbackCompany} | Praman Jobs`,
      description: "This job may have expired from our live feed, but you can explore more opportunities at Praman Jobs."
    };
  }

  return {
    title: `${job.title} at ${job.company} | Praman Jobs`,
    description: job.description || `Apply for ${job.title} at ${job.company} directly with zero dead links.`,
  };
}

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  const { allJobs, isLoggedIn } = await fetchAllJobs();

  return (
    <div className="relative min-h-screen bg-[#07080a] text-white overflow-hidden">
      {/* Sleek Grid & Ambient Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center'
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-24">
        {/* Top Hero Section - Sleek & Centered */}
        <div className="flex flex-col items-start justify-center max-w-3xl mb-16 space-y-6">
          {/* Sleek Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F0FF]/20 bg-[#00F0FF]/[0.03] text-[10px] tracking-widest uppercase font-mono-brand text-[#00F0FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
            INDIA TECH & INTERNSHIP BOARD IS LIVE
          </div>

          {/* Bold Minimal Heading */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-[72px] font-bold text-white tracking-tight leading-[1.05]">
            Find top talent with <span className="text-[#00F0FF] drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">Zero Dead Links</span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed font-light">
            Curated opportunities across Bangalore, Gurgaon, Mumbai, Hyderabad, Pune, and India-Remote. Every listing connects directly to official company career pages.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a href="#jobs" className="px-8 py-3.5 rounded-full bg-[#00F0FF] text-[#001014] font-display font-bold text-sm tracking-widest uppercase hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              Browse Jobs
            </a>
            <a href="/post-job" className="px-8 py-3.5 rounded-full bg-transparent border border-white/20 text-white font-display font-bold text-sm tracking-widest uppercase hover:bg-white/5 transition-colors">
              Hire Talent
            </a>
          </div>
        </div>

        <div id="jobs">
          <JobCardList jobs={allJobs} isLoggedIn={isLoggedIn} initialJobId={params.id} />
        </div>
      </div>
    </div>
  );
}
