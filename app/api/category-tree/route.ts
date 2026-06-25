import { NextRequest, NextResponse } from "next/server";
import { getCategories } from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
        const categoryId = sp.get("categoryId") || sp.get("id") || "0" || "0"
    const data = await getCategories(categoryId);
    return NextResponse.json({ source: "FRED", parent_id: categoryId, children: data.categories || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
        const categoryId = body.categoryId || body.id || "0"
    const data = await getCategories(categoryId);
    return NextResponse.json({ source: "FRED", parent_id: categoryId, children: data.categories || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
