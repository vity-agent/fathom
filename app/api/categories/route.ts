import { NextRequest, NextResponse } from "next/server";
import { getCategories, getCategorySeries} from "@/lib/fred";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id") || "0";
    const data = await getCategories(id);
    return NextResponse.json({ source: "FRED", category_id: id, categories: data.categories || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
