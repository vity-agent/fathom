import { NextRequest, NextResponse } from "next/server";
import { getTagSeries } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
        const tag = sp.get("tag") || ""
    const data = await getTagSeries(tag, sp.get("limit") || "20");
    return NextResponse.json({ source: "FRED", tag, series: data.series || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
        const tag = body.tag
    if (!tag) return NextResponse.json({ error: "tag is required" }, { status: 400 })
    const data = await getTagSeries(tag, body.limit || "20");
    return NextResponse.json({ source: "FRED", tag, series: data.series || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
