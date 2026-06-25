import { NextRequest, NextResponse } from "next/server";
import { getObservations } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
        const seriesId = sp.get("seriesId") || sp.get("id") || "GDP" || "GDP"
    const data = await getObservations(seriesId, {
      sort_order: sp.get("sort") || "desc", limit: sp.get("limit") || "10", observation_start: sp.get("start") || "", observation_end: sp.get("end") || "", units: sp.get("units") || "", frequency: sp.get("frequency") || ""
    });
    return NextResponse.json({ source: "FRED", series_id: seriesId, count: data.count, observations: data.observations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
        const seriesId = body.seriesId || body.id
    if (!seriesId) return NextResponse.json({ error: "Series ID is required" }, { status: 400 })
    const data = await getObservations(seriesId, {
      sort_order: body.sort || "desc", limit: body.limit || "10", observation_start: body.start || "", observation_end: body.end || "", units: body.units || "", frequency: body.frequency || ""
    });
    return NextResponse.json({ source: "FRED", series_id: seriesId, count: data.count, observations: data.observations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
