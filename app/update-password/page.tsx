// app/update-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if we have a session to update the password
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // We might be waiting for the hash fragment to be processed by Supabase
        // Supabase client automatically processes #access_token fragments on load
        setTimeout(async () => {
          const { data: { session: delayedSession } } = await supabase.auth.getSession();
          if (!delayedSession) {
            setError("Invalid or expired password reset link. Please request a new one.");
          }
          setIsReady(true);
        }, 1000);
      } else {
        setIsReady(true);
      }
    };
    
    checkSession();
  }, [supabase.auth]);

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    
    // Redirect to login or home after a short delay
    setTimeout(() => {
      router.push("/jobs");
      router.refresh();
    }, 2000);
  }

  if (!isReady) {
    return (
      <div className="min-h-[calc(100vh-76px)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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
        <h1 className="font-display text-3xl font-bold mb-2">Create New Password</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Enter your new password below to regain access to your account.
        </p>

        {success ? (
          <div className="glass-panel p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Password Updated!</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Your password has been changed successfully. Redirecting you...
            </p>
          </div>
        ) : (
          <div className="glass-panel p-7 space-y-5">
            {error && error.includes("Invalid or expired") ? (
              <div className="text-center space-y-4 py-4">
                <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl px-4 py-3">
                  {error}
                </p>
                <button
                  onClick={() => router.push("/forgot-password")}
                  className="btn-primary w-full inline-flex items-center justify-center"
                >
                  Request New Link
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-400 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                
                <div>
                  <label className="block font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-400 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="input-field"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  disabled={loading || !password || !confirmPassword}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? "Updating..." : "Update Password"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
