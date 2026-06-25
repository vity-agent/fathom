import { NextRequest, NextResponse } from "next/server";
import { getCategorySeries } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
        const categoryId = sp.get("categoryId") || sp.get("id") || "0"
    const data = await getCategorySeries(categoryId, sp.get("limit") || "20");
    return NextResponse.json({ source: "FRED", category_id: categoryId, series: data.series || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
        const categoryId = body.categoryId || body.id
    if (!categoryId) return NextResponse.json({ error: "categoryId is required" }, { status: 400 })
    const data = await getCategorySeries(categoryId, body.limit || "20");
    return NextResponse.json({ source: "FRED", category_id: categoryId, series: data.series || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
