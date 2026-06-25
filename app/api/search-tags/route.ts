import { NextRequest, NextResponse } from "next/server";
import { searchTags } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
        const q = sp.get("q") || "" || sp.get("query") || ""
    const data = await searchTags(q, sp.get("limit") || "20");
    return NextResponse.json({ source: "FRED", query: q, tags: data.tags || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
        const q = body.query || body.q
    if (!q) return NextResponse.json({ error: "query is required" }, { status: 400 })
    const data = await searchTags(q, body.limit || "20");
    return NextResponse.json({ source: "FRED", query: q, tags: data.tags || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
