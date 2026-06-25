import { NextRequest, NextResponse } from "next/server";
import { getSeriesInfo } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const seriesId = req.nextUrl.searchParams.get("seriesId") || req.nextUrl.searchParams.get("id") || "GDP";
    const data = await getSeriesInfo(seriesId);
    const items = data.series || [];
    return NextResponse.json({ source: "FRED", seriesId, info: items[0] || null });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const seriesId = body.seriesId || body.id;
    if (!seriesId) return NextResponse.json({ error: "Series ID is required" }, { status: 400 });
    const data = await getSeriesInfo(seriesId);
    const items = data.series || [];
    return NextResponse.json({ source: "FRED", seriesId, info: items[0] || null });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
