import { NextRequest, NextResponse } from "next/server";
import { getTags } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
        const limit = sp.get("limit") || "50"
    const search = sp.get("search") || ""
    const data = await getTags(limit, search);
    return NextResponse.json({ source: "FRED", tags: data.tags || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
        const limit = body.limit || "50"
    const search = body.search || ""
    const data = await getTags(limit, search);
    return NextResponse.json({ source: "FRED", tags: data.tags || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
