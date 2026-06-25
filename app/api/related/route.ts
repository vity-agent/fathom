import { NextRequest, NextResponse } from "next/server";
import { getRelatedSeries } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
        const seriesId = sp.get("seriesId") || sp.get("id") || "GDP"
    const data = await getRelatedSeries(seriesId);
    return NextResponse.json({ source: "FRED", series_id: seriesId, categories: data.categories || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
        const seriesId = body.seriesId || body.id
    if (!seriesId) return NextResponse.json({ error: "Series ID is required" }, { status: 400 })
    const data = await getRelatedSeries(seriesId);
    return NextResponse.json({ source: "FRED", series_id: seriesId, categories: data.categories || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
