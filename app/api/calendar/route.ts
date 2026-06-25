import { NextRequest, NextResponse } from "next/server";
import { getReleaseDates } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
        const limit = sp.get("limit") || "15"
    const data = await getReleaseDates(limit);
    return NextResponse.json({ source: "FRED", events: data.release_dates || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
        const limit = body.limit || "15"
    const data = await getReleaseDates(limit);
    return NextResponse.json({ source: "FRED", events: data.release_dates || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
