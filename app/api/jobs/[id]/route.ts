// app/api/jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  // Row Level Security also enforces this server-side, but checking here
  // lets us return a clear error message instead of a silent no-op.
  const { data: job } = await supabase
    .from("jobs")
    .select("recruiter_id")
    .eq("id", id)
    .single();

  if (!job || job.recruiter_id !== user.id) {
    return NextResponse.json(
      { error: "You can only delete your own job postings." },
      { status: 403 }
    );
  }

  const { error } = await supabase.from("jobs").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
