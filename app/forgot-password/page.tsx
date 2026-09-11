// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccessMsg("If your email exists in our system, you will receive a password reset link shortly.");
    setLoading(false);
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
        <h1 className="font-display text-3xl font-bold mb-2">Reset Password</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        {successMsg ? (
          <div className="glass-panel p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Check your email</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{successMsg}</p>
            <div className="pt-4">
              <Link href="/login" className="text-[#00F0FF] hover:underline text-sm font-medium">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-7 space-y-5">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-400 mb-2">
                  Email Address
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
                {loading ? "Sending link..." : "Send Reset Link"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <p className="text-center text-xs text-zinc-500 pt-1">
              Remember your password?{" "}
              <Link href="/login" className="text-[#00F0FF] hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
