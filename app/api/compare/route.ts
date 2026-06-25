import { NextRequest, NextResponse } from "next/server";
import { getObservations } from "@/lib/fred";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ids = body.seriesIds || body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 2) return NextResponse.json({ error: "seriesIds array with 2+ IDs required" }, { status: 400 });
    if (ids.length > 5) return NextResponse.json({ error: "Max 5 series for comparison" }, { status: 400 });
    const limit = body.limit || "10";
    const comparison: Record<string, any> = {};
    await Promise.all(ids.map(async (id: string) => {
      try {
        const data = await getObservations(id, { limit, sort_order: "desc" });
        const obs = data.observations || [];
        comparison[id] = {
          count: data.count,
          latest: obs[0] || null,
          observations: obs,
        };
      } catch (e: any) {
        comparison[id] = { error: e.message };
      }
    }));
    return NextResponse.json({ source: "FRED", compared: ids.length, comparison });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
