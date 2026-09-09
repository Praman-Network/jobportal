// app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "recruiter") {
    return NextResponse.json(
      { error: "Only recruiter accounts can post jobs." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { title, company, location, description, apply_url } = body;

  if (!title || !company || !description || !apply_url) {
    return NextResponse.json(
      { error: "Title, company, description, and apply link are required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      recruiter_id: user.id,
      title,
      company,
      location: location || "Remote",
      description,
      apply_url,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ job: data }, { status: 201 });
}
