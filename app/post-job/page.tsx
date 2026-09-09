// app/post-job/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    apply_url: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push("/my-postings");
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-14">
      <div className="font-mono-brand text-[11px] tracking-widest uppercase text-[#00F0FF] mb-3">
        Recruiter
      </div>
      <h1 className="font-display text-3xl font-bold mb-2">Post a job</h1>
      <p className="text-zinc-400 text-sm mb-8">
        This listing will appear on the board alongside aggregated jobs.
        Candidates apply directly on your own site via the link you provide.
      </p>

      <form onSubmit={handleSubmit} className="glass-panel p-7 space-y-5">
        <div>
          <label className="block font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-500 mb-2">
            Job Title
          </label>
          <input
            required
            className="input-field"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Frontend Developer Intern"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-500 mb-2">
              Company
            </label>
            <input
              required
              className="input-field"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </div>
          <div>
            <label className="block font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-500 mb-2">
              Location
            </label>
            <input
              className="input-field"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Remote"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-500 mb-2">
            Description
          </label>
          <textarea
            required
            rows={5}
            className="input-field resize-none"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div>
          <label className="block font-mono-brand text-[10.5px] uppercase tracking-wide text-zinc-500 mb-2">
            Apply Link (external URL)
          </label>
          <input
            required
            type="url"
            className="input-field"
            value={form.apply_url}
            onChange={(e) => update("apply_url", e.target.value)}
            placeholder="https://yourcompany.com/careers/this-role"
          />
        </div>

        {error && (
          <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
