// components/JobCardList.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import JobCard from "@/components/JobCard";
import JobDetailsModal from "@/components/JobDetailsModal";
import type { JobCardData } from "@/lib/types";
import { Search, MapPin, X } from "lucide-react";

interface JobCardListProps {
  jobs: JobCardData[];
  isLoggedIn?: boolean;
  initialJobId?: string;
}

export default function JobCardList({ jobs, isLoggedIn = false, initialJobId }: JobCardListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedJob, setSelectedJob] = useState<JobCardData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const hasOpenedInitial = useRef(false);

  // Set initial selected job if provided in URL
  useEffect(() => {
    if (initialJobId && !hasOpenedInitial.current) {
      hasOpenedInitial.current = true;
      const found = jobs.find(j => j.id === initialJobId);
      if (found) {
        setSelectedJob(found);
      } else {
        // If the job fell off the live feed, we create a fallback job to at least show something
        const isArbeitnow = initialJobId.startsWith('arbeitnow-');
        const fallbackTitle = isArbeitnow ? initialJobId.replace('arbeitnow-', '').split('-').slice(0, 4).join(' ') : 'Tech Role';
        
        setSelectedJob({
          id: initialJobId,
          title: fallbackTitle.charAt(0).toUpperCase() + fallbackTitle.slice(1),
          company: initialJobId.includes('gh-') ? initialJobId.split('-')[1] : (initialJobId.includes('lever-') ? initialJobId.split('-')[1] : 'Company'),
          location: 'India / Remote',
          tags: ['Expired or Unlisted'],
          applyUrl: 'https://pramanjobs.com',
          postedAt: new Date().toISOString(),
          origin: 'external',
          description: 'This job is no longer available in our live feed. It may have expired or been filled.',
        });
      }
    }
  }, [initialJobId, jobs]);

  const CITIES = [
    { label: "All Locations", value: "All" },
    { label: "Bangalore", value: "bangalore" },
    { label: "Delhi NCR / Gurgaon", value: "gurgaon" },
    { label: "Mumbai", value: "mumbai" },
    { label: "Hyderabad", value: "hyderabad" },
    { label: "Pune", value: "pune" },
    { label: "Remote (India)", value: "remote" },
  ];

  const TYPES = [
    { label: "All Roles", value: "All" },
    { label: "Internships", value: "intern" },
    { label: "Full-time", value: "full-time" },
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesLocation = job.location.toLowerCase().includes(query);
        const matchesTags = job.tags && job.tags.some((t) => t.toLowerCase().includes(query));
        const matchesDesc = job.description ? job.description.toLowerCase().includes(query) : false;

        if (!matchesTitle && !matchesCompany && !matchesLocation && !matchesTags && !matchesDesc) {
          return false;
        }
      }

      // 2. City Filter
      if (selectedCity !== "All") {
        const loc = job.location.toLowerCase();
        if (selectedCity === "gurgaon" && (loc.includes("gurgaon") || loc.includes("delhi") || loc.includes("noida"))) {
          // match
        } else if (!loc.includes(selectedCity)) {
          return false;
        }
      }

      // 3. Type Filter
      if (selectedType !== "All") {
        const isIntern =
          job.jobType === "Internship" ||
          job.title.toLowerCase().includes("intern") ||
          (job.tags && job.tags.some((t) => t.toLowerCase().includes("intern")));

        if (selectedType === "intern" && !isIntern) return false;
        if (selectedType === "full-time" && isIntern) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedCity, selectedType]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCity !== "All" ||
    selectedType !== "All";

  function resetFilters() {
    setSearchQuery("");
    setSelectedCity("All");
    setSelectedType("All");
    setCurrentPage(1);
  }

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCity, selectedType]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Search & Filter Control Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#0b0c16]/90 backdrop-blur-xl p-5 shadow-2xl space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, company, skill (e.g., 'React Intern', 'Swiggy', 'Golang', 'Bangalore')..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF] focus:ring-2 focus:ring-[#00F0FF]/20 transition-all"
          />
          {searchQuery && (
            <button
               onClick={() => setSearchQuery("")}
               className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills Grid */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-white/5">
          {/* City Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-mono-brand text-zinc-500 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" /> City:
            </span>
            {CITIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCity(c.value)}
                className={`text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap font-medium transition-all ${
                  selectedCity === c.value
                    ? "border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/10 font-bold shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                    : "border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Role Type Selector */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-lg p-0.5">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                    selectedType === t.value
                      ? "bg-[#00F0FF] text-[#001014] font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-mono-brand uppercase flex items-center gap-1 px-2 py-1"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs font-mono-brand text-zinc-400">
          Showing <span className="text-[#00F0FF] font-bold">{filteredJobs.length}</span> verified Indian tech openings
        </div>
        {hasActiveFilters && (
          <div className="text-xs text-zinc-500">
            Filtered results
          </div>
        )}
      </div>

      {/* Job Cards List */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.015] p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">No matching roles found</h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Try adjusting your search keywords, switching cities, or clearing filters to see all available opportunities.
          </p>
          <button onClick={resetFilters} className="btn-ghost text-xs">
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {currentJobs.map((job, i) => (
              <JobCard 
                key={`${job.id}-${i}`} 
                job={job} 
                index={i} 
                isLoggedIn={isLoggedIn} 
                onClick={() => setSelectedJob(job)}
              />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 pb-4">
              <button
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: document.getElementById('jobs')?.offsetTop || 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg font-mono-brand text-xs tracking-wider uppercase bg-white/[0.03] border border-white/10 text-zinc-400 hover:text-white hover:border-[#00F0FF]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1.5 font-mono-brand text-xs text-zinc-400 mx-2">
                <span className="text-[#00F0FF] font-bold">{currentPage}</span>
                <span className="text-zinc-600">/</span>
                <span>{totalPages}</span>
              </div>
              
              <button
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: document.getElementById('jobs')?.offsetTop || 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg font-mono-brand text-xs tracking-wider uppercase bg-white/[0.03] border border-white/10 text-zinc-400 hover:text-white hover:border-[#00F0FF]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isLoggedIn={isLoggedIn}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
