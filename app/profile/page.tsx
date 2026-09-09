// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import type { Profile } from "@/lib/types";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Briefcase,
  PlusCircle,
  LayoutList,
  LogOut,
  Sparkles,
  MapPin,
  CheckCircle2,
  Edit3,
  Save,
  ArrowRight,
} from "lucide-react";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [role, setRole] = useState<"student" | "recruiter">("student");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [activeJobsCount, setActiveJobsCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email || "");

      // Load profile from public.profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      const resolvedName =
        profile?.full_name || (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "User";
      const resolvedRole =
        (profile?.role as "student" | "recruiter") ||
        (user.user_metadata?.role as "student" | "recruiter") ||
        "student";
      const resolvedCreatedAt = profile?.created_at || user.created_at || new Date().toISOString();

      setFullName(resolvedName);
      setRole(resolvedRole);
      setCreatedAt(resolvedCreatedAt);

      // If recruiter, query active jobs count
      if (resolvedRole === "recruiter") {
        const { count } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .eq("recruiter_id", user.id);
        setActiveJobsCount(count || 0);
      }

      setLoading(false);
    }

    loadProfile();
  }, [router, supabase]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) return;

    setSaving(true);
    setFeedback(null);

    try {
      // 1. Update in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          full_name: fullName.trim(),
          role,
        });

      if (profileError) throw profileError;

      // 2. Update user metadata
      await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });

      setFeedback({
        type: "success",
        message: "Profile updated successfully!",
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.message || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-76px)] flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#00F0FF] border-t-transparent animate-spin" />
          <p className="font-mono-brand text-xs uppercase tracking-widest text-zinc-500">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  const userInitial = (fullName.charAt(0) || userEmail.charAt(0) || "U").toUpperCase();
  const joinedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent Member";

  return (
    <div className="relative min-h-[calc(100vh-76px)] bg-[#06060c] text-white py-12 px-6">
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[420px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 10%, rgba(0,240,255,0.1), rgba(168,85,247,0.05) 50%, transparent 80%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto space-y-8">
        {/* Header Title */}
        <div>
          <div className="font-mono-brand text-[11px] tracking-widest uppercase text-[#00F0FF] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
            {role === "recruiter" ? "Recruiter Account" : "Student Member"}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Account Profile
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your personal profile details and platform preferences.
          </p>
        </div>

        {/* Profile Card Summary */}
        <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F0FF]/20 to-purple-500/20 border border-[#00F0FF]/30 flex items-center justify-center font-display font-extrabold text-2xl text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.15)] shrink-0">
                {userInitial}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-white truncate">
                    {fullName}
                  </h2>
                  <span
                    className={`font-mono-brand text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                      role === "recruiter"
                        ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
                        : "border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF]"
                    }`}
                  >
                    {role === "recruiter" ? "💼 Recruiter" : "🎓 Student"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs sm:text-sm mt-1">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{userEmail}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono-brand text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded ml-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 text-xs font-mono-brand uppercase tracking-wider text-rose-400 border border-rose-500/25 bg-rose-500/5 hover:bg-rose-500/15 px-4 py-2 rounded-xl transition-colors self-start sm:self-center"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>

          {/* Quick Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs text-zinc-400">
            <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
              <Calendar className="w-4 h-4 text-[#00F0FF]" />
              <div>
                <div className="font-mono-brand text-[10px] uppercase text-zinc-500">Joined</div>
                <div className="text-zinc-200 font-medium">{joinedDate}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-mono-brand text-[10px] uppercase text-zinc-500">Status</div>
                <div className="text-emerald-400 font-medium">Active Member</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
              {role === "recruiter" ? (
                <>
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-mono-brand text-[10px] uppercase text-zinc-500">
                      My Postings
                    </div>
                    <div className="text-purple-300 font-bold">{activeJobsCount} Active Roles</div>
                  </div>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                  <div>
                    <div className="font-mono-brand text-[10px] uppercase text-zinc-500">
                      Opportunities
                    </div>
                    <div className="text-[#00F0FF] font-bold">420+ Live Openings</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Role-Specific Action Center */}
        {role === "recruiter" ? (
          <div className="glass-panel p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Recruiter Actions</h3>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Publish new engineering positions and manage candidate direct links.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/post-job"
                className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-300 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-display font-bold text-sm text-white">Post a New Job</div>
                    <div className="text-xs text-zinc-400">Add listing to live board</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/my-postings"
                className="flex items-center justify-between p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 text-purple-300 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="font-display font-bold text-sm text-white">
                      Manage My Postings
                    </div>
                    <div className="text-xs text-zinc-400">{activeJobsCount} active postings</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-6 sm:p-7 space-y-4">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Candidate Dashboard</h3>
              <p className="text-zinc-400 text-xs mt-0.5">
                Explore curated tech roles across India tech hubs with 100% direct company apply.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/jobs"
                className="flex items-center justify-between p-4 rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/5 hover:bg-[#00F0FF]/10 text-white transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <LayoutList className="w-5 h-5 text-[#00F0FF]" />
                  <div>
                    <div className="font-display font-bold text-sm text-white">Browse Jobs Board</div>
                    <div className="text-xs text-zinc-400">Search 420+ verified roles</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#00F0FF] group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
                <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
                <div className="text-xs text-zinc-400">
                  <span className="font-medium text-zinc-200">Active Tech Hubs:</span> Bangalore, Delhi NCR, Mumbai, Hyderabad, Pune & Remote
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Form */}
        <div className="glass-panel p-6 sm:p-7 space-y-5">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#00F0FF]" />
            <h3 className="font-display font-bold text-lg text-white">Edit Profile Details</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-400 mb-2">
                Display Name
              </label>
              <input
                type="text"
                required
                className="input-field"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Full Name"
              />
            </div>

            <div>
              <label className="block font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-400 mb-2">
                Account Email
              </label>
              <input
                type="email"
                disabled
                className="input-field opacity-60 cursor-not-allowed bg-white/[0.02]"
                value={userEmail}
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Account email is tied to your login credentials.
              </p>
            </div>

            <div>
              <label className="block font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-400 mb-2">
                Account Type
              </label>
              <input
                type="text"
                disabled
                className="input-field opacity-60 cursor-not-allowed bg-white/[0.02]"
                value={role === "recruiter" ? "Verified Recruiter Account" : "Student Member Account"}
              />
            </div>

            {feedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
                  feedback.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
