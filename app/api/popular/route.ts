import { NextResponse } from "next/server";
import { POPULAR_SERIES } from "@/lib/fred";

export async function GET() {
  return NextResponse.json({ source: "FRED", count: Object.keys(POPULAR_SERIES).length, series: POPULAR_SERIES });
}
