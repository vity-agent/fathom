import { NextRequest, NextResponse } from "next/server";
import { getObservations } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("seriesId") || req.nextUrl.searchParams.get("id") || "GDP";
    const data = await getObservations(id, { limit: "1", sort_order: "desc" });
    const obs = data.observations || [];
    return NextResponse.json({ source: "FRED", series_id: id, latest: obs[0] || null, count: data.count });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.seriesId || body.id;
    if (!id) return NextResponse.json({ error: "seriesId is required" }, { status: 400 });
    const data = await getObservations(id, { limit: "1", sort_order: "desc" });
    const obs = data.observations || [];
    return NextResponse.json({ source: "FRED", series_id: id, latest: obs[0] || null, count: data.count });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
