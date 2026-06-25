import { NextResponse } from "next/server";
import { getObservations } from "@/lib/fred";

const INDICATORS = [
  { id: "GDP", name: "Gross Domestic Product", unit: "Billions $" },
  { id: "UNRATE", name: "Unemployment Rate", unit: "%" },
  { id: "CPIAUCSL", name: "Consumer Price Index", unit: "Index" },
  { id: "FEDFUNDS", name: "Federal Funds Rate", unit: "%" },
  { id: "DGS10", name: "10-Year Treasury", unit: "%" },
  { id: "SP500", name: "S&P 500", unit: "Index" },
  { id: "M2SL", name: "M2 Money Supply", unit: "Billions $" },
  { id: "DCOILWTICO", name: "Crude Oil WTI", unit: "$/bbl" },
  { id: "GOLDAMGBD228NLBM", name: "Gold Price", unit: "$" },
  { id: "T10Y2Y", name: "10Y-2Y Spread", unit: "%" },
];

export async function GET() {
  try {
    const snapshot: Record<string, any> = {};
    await Promise.all(INDICATORS.map(async (ind) => {
      try {
        const data = await getObservations(ind.id, { limit: "1", sort_order: "desc" });
        const obs = data.observations || [];
        snapshot[ind.id] = { name: ind.name, unit: ind.unit, latest: obs[0] || null };
      } catch {
        snapshot[ind.id] = { name: ind.name, unit: ind.unit, error: "fetch failed" };
      }
    }));
    return NextResponse.json({ source: "FRED", timestamp: new Date().toISOString(), snapshot });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const snapshot: Record<string, any> = {};
    await Promise.all(INDICATORS.map(async (ind) => {
      try {
        const data = await getObservations(ind.id, { limit: "1", sort_order: "desc" });
        const obs = data.observations || [];
        snapshot[ind.id] = { name: ind.name, unit: ind.unit, latest: obs[0] || null };
      } catch {
        snapshot[ind.id] = { name: ind.name, unit: ind.unit, error: "fetch failed" };
      }
    }));
    return NextResponse.json({ source: "FRED", timestamp: new Date().toISOString(), snapshot });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
