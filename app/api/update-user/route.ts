import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { line_user_id, name, phone, citizenId, email, pictureUrl } = body;

  if (!line_user_id || !name || !phone || !citizenId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("members")
    .insert([
      { line_user_id, name, phone, citizen_id: citizenId, email, picture_url: pictureUrl }
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}