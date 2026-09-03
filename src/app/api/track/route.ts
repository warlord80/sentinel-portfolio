import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { path, section } = await req.json();
    if (!path) return NextResponse.json({ ok: true });

    const supabase = await createClient();

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";
    const ipHashBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
    const ipHash = Array.from(new Uint8Array(ipHashBuf).slice(0, 8))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    await supabase.from("page_views").insert({
      path,
      section: section ?? null,
      referrer: req.headers.get("referer"),
      user_agent: req.headers.get("user-agent")?.slice(0, 200),
      ip_hash: ipHash,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
