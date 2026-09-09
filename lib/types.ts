// lib/types.ts

export type UserRole = "student" | "recruiter";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface InternalJob {
  id: string;
  recruiter_id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  apply_url: string;
  is_active: boolean;
  created_at: string;
}

export interface JobCardData {
  id: string;
  title: string;
  company: string;
  location: string;
  tags: string[];
  applyUrl: string;
  postedAt: string | null;
  origin: "internal" | "external";
  sourceName?: string;
  jobType?: "Internship" | "Full-time" | "Contract" | "Part-time";
  stipendOrSalary?: string;
  experienceLevel?: string;
  description?: string;
}
