import { NextRequest, NextResponse } from "next/server";
import { searchSeries } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q");
    const limit = req.nextUrl.searchParams.get("limit") || "10";
    if (!q) return NextResponse.json({ error: "Missing query param ?q=" }, { status: 400 });
    const data = await searchSeries(q, limit);
    return NextResponse.json({
      source: "FRED",
      query: q,
      count: data.count,
      series: (data.series || []).slice(0, parseInt(limit)).map((s: any) => ({
        id: s.id,
        title: s.title,
        units: s.units,
        frequency: s.frequency,
        popularity: s.popularity,
        last_updated: s.last_updated,
        observation_start: s.observation_start,
        observation_end: s.observation_end,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
