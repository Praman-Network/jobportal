// components/JobDetailsModal.tsx
"use client";

import { useEffect, useRef } from "react";
import { X, Building2, MapPin, Banknote, Clock, ArrowUpRight, Sparkles } from "lucide-react";
import type { JobCardData } from "@/lib/types";

interface JobDetailsModalProps {
  job: JobCardData;
  isLoggedIn: boolean;
  onClose: () => void;
}

export default function JobDetailsModal({ job, isLoggedIn, onClose }: JobDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const postedLabel = job.postedAt
    ? new Date(job.postedAt).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })
    : "Recently";

  const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : "J";
  const isInternship =
    job.jobType === "Internship" ||
    job.title.toLowerCase().includes("intern") ||
    (job.tags && job.tags.some((t) => t.toLowerCase().includes("intern")));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-[#020306]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#0b0d14] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
      >
        {/* Header - Fixed */}
        <div className="flex-none p-6 sm:p-8 border-b border-white/5 bg-[#0d0f1a]/50">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-start gap-4 sm:gap-6 pr-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#00F0FF]/20 to-purple-500/10 border border-white/10 flex items-center justify-center shrink-0 shadow-inner font-display font-bold text-2xl text-[#00F0FF]">
              {companyInitial}
            </div>
            
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="font-display font-bold text-white text-xl sm:text-2xl leading-tight">
                  {job.title}
                </h2>
                {isInternship && (
                  <span className="inline-flex items-center gap-1 font-mono-brand text-[10px] uppercase font-semibold tracking-wider px-2 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300">
                    <Sparkles className="w-3 h-3" /> Internship
                  </span>
                )}
              </div>
              
              <div className="font-mono-brand text-xs uppercase tracking-wider text-zinc-400 mt-2">
                {job.company}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="space-y-1">
              <div className="text-zinc-500 text-[10px] uppercase font-mono-brand tracking-widest flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </div>
              <div className="text-zinc-200 text-sm font-medium">{job.location}</div>
            </div>
            
            {job.stipendOrSalary && (
              <div className="space-y-1">
                <div className="text-zinc-500 text-[10px] uppercase font-mono-brand tracking-widest flex items-center gap-1">
                  <Banknote className="w-3 h-3" /> Pay / CTC
                </div>
                <div className="text-emerald-400 text-sm font-medium">{job.stipendOrSalary}</div>
              </div>
            )}
            
            {job.experienceLevel && (
              <div className="space-y-1">
                <div className="text-zinc-500 text-[10px] uppercase font-mono-brand tracking-widest flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Experience
                </div>
                <div className="text-zinc-200 text-sm font-medium">{job.experienceLevel}</div>
              </div>
            )}
            
            <div className="space-y-1">
              <div className="text-zinc-500 text-[10px] uppercase font-mono-brand tracking-widest flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Source
              </div>
              <div className="text-zinc-200 text-sm font-medium">
                {job.origin === "internal" ? "Verified Recruiter" : job.sourceName || "Direct Portal"}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h3 className="text-white font-display font-bold text-lg">About the Role</h3>
            <div className="text-zinc-400 text-sm leading-relaxed space-y-4">
              {job.description ? (
                <p>{job.description}</p>
              ) : (
                <p className="italic text-zinc-500">No detailed description provided. Please click Apply to read more on the company site.</p>
              )}
            </div>
          </div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="mt-8 space-y-3">
              <h3 className="text-zinc-500 text-[10px] uppercase font-mono-brand tracking-widest">Required Skills / Tags</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono-brand text-zinc-300 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="flex-none p-6 sm:p-8 border-t border-white/5 bg-[#07080a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono-brand text-zinc-500 text-center sm:text-left">
            Posted {postedLabel}
          </div>
          
          <div className="w-full sm:w-auto">
            {isLoggedIn ? (
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-display font-bold text-sm uppercase tracking-widest bg-[#00F0FF] hover:bg-white text-[#001014] px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all"
              >
                Apply Now <ArrowUpRight className="w-4 h-4" />
              </a>
            ) : (
              <a
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-display font-bold text-sm uppercase tracking-widest bg-[#00F0FF] hover:bg-white text-[#001014] px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all"
              >
                Log In to Apply <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
