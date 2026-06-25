import { NextRequest, NextResponse } from "next/server";
import { getReleases, getReleaseDates } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
        const limit = sp.get("limit") || "20"
    const dates = sp.get("dates")
    const data = await dates ? await getReleaseDates(limit) : await getReleases(limit);
    return NextResponse.json({ source: "FRED", ...data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
        const limit = body.limit || "20"
    const dates = body.dates
    const data = await dates ? await getReleaseDates(limit) : await getReleases(limit);
    return NextResponse.json({ source: "FRED", ...data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
