import { NextRequest, NextResponse } from "next/server";
import { getSources } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    
    const data = await getSources();
    return NextResponse.json({ source: "FRED", sources: data.sources || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const data = await getSources();
    return NextResponse.json({ source: "FRED", sources: data.sources || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
