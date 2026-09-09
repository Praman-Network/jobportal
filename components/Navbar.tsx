// components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Briefcase, PlusCircle, LayoutList, LogOut, Menu, X, User } from "lucide-react";

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 1. Initial user check
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoggedIn(false);
        setRole(null);
        return;
      }
      setLoggedIn(true);

      // Query profile role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const resolvedRole =
        profile?.role ||
        (user.user_metadata?.role as string) ||
        "student";

      setRole(resolvedRole);
    }

    checkUser();

    // 2. Real-time auth listener for immediate updates on login / logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setLoggedIn(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        const resolvedRole =
          profile?.role ||
          (session.user.user_metadata?.role as string) ||
          "student";

        setRole(resolvedRole);
      } else {
        setLoggedIn(false);
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setRole(null);
    window.location.href = "/login";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#06060c]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[76px] flex items-center justify-between">
        {/* Brand Logo - Enlarged & Crisp */}
        <Link href="/jobs" className="flex items-center group py-1 shrink-0">
          <Image
            src="/praman-logo.png"
            alt="Praman"
            width={200}
            height={68}
            className="h-11 sm:h-12 md:h-13 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/jobs"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LayoutList className="w-3.5 h-3.5 text-[#00F0FF]" /> Browse Jobs
          </Link>

          {role === "recruiter" && (
            <>
              <Link
                href="/post-job"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" /> Post a Job
              </Link>
              <Link
                href="/my-postings"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-purple-400" /> My Postings
              </Link>
            </>
          )}

          {loggedIn === true && (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-zinc-300" /> Profile
            </Link>
          )}
        </div>

        {/* Right side (Desktop Auth + Mobile Buttons) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {loggedIn === false && (
              <>
                <Link
                  href="/login"
                  className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors px-2"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="font-display font-bold text-[12px] uppercase tracking-wide bg-[#00F0FF] text-[#001014] px-4 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-shadow"
                >
                  Sign Up
                </Link>
              </>
            )}

            {loggedIn === true && (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:border-[#00F0FF]/40 hover:bg-white/[0.08] transition-all group"
                  title="View Profile"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse" />
                  <span className="font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-300 group-hover:text-white">
                    {role === "recruiter" ? "Recruiter" : "Student"}
                  </span>
                  <User className="w-3 h-3 text-zinc-400 group-hover:text-[#00F0FF] transition-colors ml-0.5" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-rose-400 hover:bg-white/5 transition-colors border border-transparent hover:border-rose-500/20"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Recruiter / Student Pill */}
          {loggedIn === true && (
            <Link
              href="/profile"
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] hover:border-[#00F0FF]/40 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse" />
              <span className="font-mono-brand text-[9.5px] uppercase tracking-wide text-zinc-300">
                {role === "recruiter" ? "Recruiter" : "Student"}
              </span>
            </Link>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#00F0FF]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#070810]/95 backdrop-blur-2xl px-5 py-5 space-y-4 shadow-2xl animate-in fade-in duration-150">
          <div className="space-y-1.5">
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              <LayoutList className="w-4 h-4 text-[#00F0FF]" /> Browse Jobs
            </Link>

            {role === "recruiter" && (
              <>
                <Link
                  href="/post-job"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" /> Post a Job
                </Link>
                <Link
                  href="/my-postings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  <Briefcase className="w-4 h-4 text-purple-400" /> My Postings
                </Link>
              </>
            )}

            {loggedIn === true && (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
              >
                <User className="w-4 h-4 text-emerald-400" /> My Profile
              </Link>
            )}
          </div>

          {/* Mobile Auth actions */}
          <div className="pt-3 border-t border-white/5">
            {loggedIn === false ? (
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs font-semibold py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center font-display font-bold text-xs uppercase tracking-wide bg-[#00F0FF] text-[#001014] py-2.5 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono-brand text-xs uppercase text-zinc-300">
                    {role === "recruiter" ? "Recruiter Account" : "Student Account"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-mono-brand px-3 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}


