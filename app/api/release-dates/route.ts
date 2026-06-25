import { NextRequest, NextResponse } from "next/server";
import { getReleaseDatesForRelease } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
        const releaseId = sp.get("releaseId") || sp.get("id") || ""
    const data = await getReleaseDatesForRelease(releaseId, sp.get("limit") || "10");
    return NextResponse.json({ source: "FRED", release_id: releaseId, dates: data.release_dates || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
        const releaseId = body.releaseId || body.id
    if (!releaseId) return NextResponse.json({ error: "releaseId is required" }, { status: 400 })
    const data = await getReleaseDatesForRelease(releaseId, body.limit || "10");
    return NextResponse.json({ source: "FRED", release_id: releaseId, dates: data.release_dates || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
