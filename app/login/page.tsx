// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleOAuth(provider: "google") {
    setError(null);
    setLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/jobs`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || `Failed to sign in with ${provider}`);
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Auto-heal / ensure profile exists for the user in public.profiles
    if (data.user) {
      try {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!existingProfile) {
          const userMeta = data.user.user_metadata || {};
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: userMeta.full_name || email.split("@")[0],
            role: userMeta.role || "student",
          });
        }
      } catch (err) {
        console.warn("Profile sync on login:", err);
      }
    }

    // Full page navigation to refresh all server cookies & Navbar auth state
    window.location.href = "/jobs";
  }

  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center justify-center px-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(0,240,255,0.08), transparent)",
        }}
      />
      <div className="relative max-w-md w-full py-16">
        <div className="mb-6">
          <Image
            src="/praman-logo.png"
            alt="Praman"
            width={150}
            height={50}
            className="h-9 sm:h-10 w-auto object-contain"
            priority
          />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">Log in</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Browse verified India jobs & internships, or manage your postings.
        </p>

        <div className="glass-panel p-7 space-y-5">
          {/* Social OAuth Buttons */}
          <div>
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-white text-sm font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="font-mono-brand text-[10.5px] uppercase tracking-wider text-zinc-500">
              OR
            </span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-400 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-400 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs sm:text-sm text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl px-3.5 py-2.5 leading-relaxed">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full inline-flex items-center justify-center gap-2"
            >
              {loading ? "Logging in..." : "Log In"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <p className="text-center text-xs text-zinc-500 pt-1">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#00F0FF] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

