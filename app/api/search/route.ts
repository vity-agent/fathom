import { NextRequest, NextResponse } from "next/server";
import { searchSeries } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q");
    const limit = req.nextUrl.searchParams.get("limit") || "10";
    if (!q) return NextResponse.json({ error: "Missing query param ?q=" }, { status: 400 });
    const data = await searchSeries(q, limit);
    return NextResponse.json({
      source: "FRED", query: q, count: data.count,
      series: (data.series || []).slice(0, parseInt(limit)).map((item: any) => ({
        id: item.id, title: item.title, units: item.units, frequency: item.frequency,
        popularity: item.popularity, last_updated: item.last_updated,
        observation_start: item.observation_start, observation_end: item.observation_end,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const q = body.query || body.q;
    const limit = body.limit || "10";
    if (!q) return NextResponse.json({ error: "query is required" }, { status: 400 });
    const data = await searchSeries(q, limit);
    return NextResponse.json({
      source: "FRED", query: q, count: data.count,
      series: (data.series || []).slice(0, parseInt(limit)).map((item: any) => ({
        id: item.id, title: item.title, units: item.units, frequency: item.frequency,
        popularity: item.popularity, last_updated: item.last_updated,
        observation_start: item.observation_start, observation_end: item.observation_end,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
