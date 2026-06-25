import { NextRequest, NextResponse } from "next/server";
import { getObservations } from "@/lib/fred";

export async function GET(req: NextRequest, { params }: { params: Promise<{ seriesId: string }> }) {
  try {
    const { seriesId } = await params;
    const sp = req.nextUrl.searchParams;
    const data = await getObservations(seriesId, {
      sort_order: sp.get("sort") || "desc",
      limit: sp.get("limit") || "10",
      observation_start: sp.get("start") || "",
      observation_end: sp.get("end") || "",
      units: sp.get("units") || "",
      frequency: sp.get("frequency") || "",
    });
    return NextResponse.json({ source: "FRED", series_id: seriesId, count: data.count, observations: data.observations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
