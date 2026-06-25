import { NextRequest, NextResponse } from "next/server";
import { getObservations } from "@/lib/fred";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ids = body.seriesIds || body.ids;
    if (!ids || !Array.isArray(ids) || ids.length === 0) return NextResponse.json({ error: "seriesIds array is required" }, { status: 400 });
    const limit = body.limit || "5";
    const results: Record<string, any> = {};
    await Promise.all(ids.map(async (id: string) => {
      try {
        const data = await getObservations(id, { limit, sort_order: "desc" });
        results[id] = { count: data.count, observations: data.observations };
      } catch (e: any) {
        results[id] = { error: e.message };
      }
    }));
    return NextResponse.json({ source: "FRED", requested: ids.length, results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
