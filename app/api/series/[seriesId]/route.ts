import { NextRequest, NextResponse } from "next/server";
import { getSeriesInfo } from "@/lib/fred";

export async function GET(req: NextRequest, { params }: { params: Promise<{ seriesId: string }> }) {
  try {
    const { seriesId } = await params;
    const data = await getSeriesInfo(seriesId);
    const items = data.series || [];
    return NextResponse.json({
      source: "FRED",
      seriesId,
      info: items[0] || null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
