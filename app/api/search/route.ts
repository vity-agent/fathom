import { NextRequest, NextResponse } from "next/server";
import { searchSeries } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q = sp.get("q") || "";
    if (!q) return NextResponse.json({ error: "Missing query param ?q=" }, { status: 400 });
    const limit = sp.get("limit") || "10";
    const data = await searchSeries(q, limit);
    return NextResponse.json({
      source: "FRED", query: q, count: data.count,
      series: (data.series || []).slice(0, parseInt(limit)).map((item: any) => ({
        id: item.id, title: item.title, units: item.units, frequency: item.frequency, popularity: item.popularity,
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
    if (!q) return NextResponse.json({ error: "query is required" }, { status: 400 });
    const limit = body.limit || "10";
    const data = await searchSeries(q, limit);
    return NextResponse.json({
      source: "FRED", query: q, count: data.count,
      series: (data.series || []).slice(0, parseInt(limit)).map((item: any) => ({
        id: item.id, title: item.title, units: item.units, frequency: item.frequency, popularity: item.popularity,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
