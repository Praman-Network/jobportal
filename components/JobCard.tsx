// components/JobCard.tsx
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Building2, Banknote, Clock, Sparkles } from "lucide-react";
import type { JobCardData } from "@/lib/types";

export default function JobCard({ job, index }: { job: JobCardData; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  const postedLabel = job.postedAt
    ? new Date(job.postedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
    : null;

  const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : "J";
  const isInternship =
    job.jobType === "Internship" ||
    job.title.toLowerCase().includes("intern") ||
    (job.tags && job.tags.some((t) => t.toLowerCase().includes("intern")));

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.35 }}
      className="relative rounded-2xl border border-white/10 bg-[#0d0f1a]/80 backdrop-blur-md p-6 overflow-hidden group hover:border-[#00F0FF]/40 hover:shadow-[0_4px_30px_rgba(0,240,255,0.07)] transition-all duration-300"
    >
      {/* Interactive cursor spotlight */}
      <div
        className="absolute pointer-events-none inset-0 transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(0,240,255,0.09), transparent 80%)`,
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3.5 min-w-0">
          {/* Company Avatar */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner font-display font-bold text-base text-[#00F0FF]">
            {companyInitial}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-white text-base md:text-lg group-hover:text-[#00F0FF] transition-colors leading-snug">
                {job.title}
              </h3>
              {isInternship && (
                <span className="inline-flex items-center gap-1 font-mono-brand text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300">
                  <Sparkles className="w-2.5 h-2.5" /> Internship
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-zinc-400 text-xs sm:text-[13px]">
              <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                <Building2 className="w-3.5 h-3.5 text-[#00F0FF]/80" /> {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400/80" /> {job.location}
              </span>
              {job.stipendOrSalary && (
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Banknote className="w-3.5 h-3.5" /> {job.stipendOrSalary}
                </span>
              )}
              {job.experienceLevel && (
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Clock className="w-3.5 h-3.5" /> {job.experienceLevel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Clean Source Badge */}
        <div className="shrink-0 flex items-center md:flex-col md:items-end gap-2">
          <span className="font-mono-brand text-[9.5px] uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap text-zinc-300 border-white/10 bg-white/[0.04]">
            {job.origin === "internal" ? "Verified Recruiter" : job.sourceName || "Direct Tech Portal"}
          </span>
        </div>
      </div>

      {job.description && (
        <p className="relative z-10 text-zinc-400 text-xs sm:text-[13px] line-clamp-2 mb-4 leading-relaxed font-sans">
          {job.description}
        </p>
      )}

      {job.tags && job.tags.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-1.5 mb-5">
          {job.tags.map((tag, tagIndex) => (
            <span
              key={`${tag}-${tagIndex}`}
              className="text-[11px] font-mono-brand text-zinc-400 bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-1 group-hover:border-white/20 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5">
        {postedLabel ? (
          <span className="text-xs font-mono-brand text-zinc-500">Posted {postedLabel}</span>
        ) : (
          <span className="text-xs font-mono-brand text-emerald-400/90 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Actively Hiring
          </span>
        )}
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-display font-bold text-xs uppercase tracking-wider bg-[#00F0FF] hover:bg-[#33f3ff] text-[#001014] px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all transform hover:-translate-y-0.5"
        >
          Apply on Company Site <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
