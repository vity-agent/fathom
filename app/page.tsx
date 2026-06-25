"use client";
import { useState } from "react";

const C = {
  bg: "#06090f",
  surface: "#0c1220",
  border: "#1a2744",
  text: "#e2e8f0",
  muted: "#64748b",
  accent: "#38bdf8",
  gradient: "linear-gradient(135deg, #0ea5e9, #6366f1)",
};

const INDICATORS = [
  { key: "GDP", name: "Gross Domestic Product", val: "$31.8T", change: "+1.3%", up: true },
  { key: "UNRATE", name: "Unemployment Rate", val: "4.1%", change: "+0.1", up: false },
  { key: "CPI", name: "Consumer Price Index", val: "322.9", change: "+2.4%", up: false },
  { key: "FEDFUNDS", name: "Fed Funds Rate", val: "4.50%", change: "-0.25", up: true },
  { key: "DGS10", name: "10Y Treasury", val: "4.28%", change: "+0.05", up: false },
  { key: "SP500", name: "S&P 500", val: "5,892", change: "+0.7%", up: true },
];

const ENDPOINTS = [
  { path: "/api/snapshot", price: "$0.20", desc: "Dashboard — 10 key indicators", tag: "INTEL" },
  { path: "/api/compare", price: "$0.15", desc: "Compare 2-5 series side by side", tag: "INTEL" },
  { path: "/api/bulk", price: "$0.15", desc: "Multi-series fetch in one call", tag: "DATA" },
  { path: "/api/observations", price: "$0.06", desc: "Data values for any Series", tag: "DATA" },
  { path: "/api/search", price: "$0.06", desc: "Search 816K+ economic series", tag: "FIND" },
  { path: "/api/calendar", price: "$0.08", desc: "Economic release calendar", tag: "DATA" },
  { path: "/api/series", price: "$0.06", desc: "Series metadata", tag: "META" },
  { path: "/api/popular", price: "$0.04", desc: "Top 20 watched indicators", tag: "FIND" },
];

export default function Home() {
  const [q, setQ] = useState("");
  const [out, setOut] = useState("");
  const [load, setLoad] = useState(false);

  const run = async () => {
    setLoad(true);
    try { const r = await fetch(q); setOut(JSON.stringify(await r.json(), null, 2)); }
    catch (e: any) { setOut("Error: " + e.message); }
    setLoad(false);
  };

  const tagColor = (t: string) => {
    if (t === "INTEL") return { bg: "#1e1b4b", fg: "#a78bfa" };
    if (t === "DATA") return { bg: "#0c4a6e", fg: "#38bdf8" };
    return { bg: "#1a2e1a", fg: "#4ade80" };
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Hero */}
      <div style={{ padding: "6rem 2rem 3rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 800, color: "#fff" }}>F</div>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, fontWeight: 600 }}>Fathom</span>
        </div>
        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.25rem", maxWidth: 650 }}>
          <span style={{ background: C.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Deep economic data,</span><br/>
          <span style={{ color: C.text }}>clean API.</span>
        </h1>
        <p style={{ fontSize: "1.1rem", color: C.muted, lineHeight: 1.7, maxWidth: 480, marginBottom: "2.5rem" }}>
          816,000+ Federal Reserve economic time series. GDP, inflation, employment, rates. x402 — pay per request.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {[["816K+", "Time Series"], ["23", "Endpoints"], ["$0.04", "Per Request"], ["120", "Req / Min"]].map(([v, l], i) => (
            <div key={i} style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 12, padding: "1.25rem 1.75rem" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: C.accent }}>{v}</div>
              <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator Board */}
      <div style={{ padding: "0 2rem 3rem", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: C.muted, marginBottom: "1rem", fontWeight: 600 }}>Live Indicator Board</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
          {INDICATORS.map((ind, i) => (
            <div key={i} style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: C.accent, fontWeight: 700, marginBottom: 4 }}>{ind.key}</div>
                <div style={{ fontSize: "0.7rem", color: C.muted }}>{ind.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{ind.val}</div>
                <div style={{ fontSize: "0.75rem", color: ind.up ? "#22c55e" : "#ef4444", fontWeight: 600 }}>{ind.change}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Endpoints */}
      <div style={{ padding: "0 2rem 3rem", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: C.muted, marginBottom: "1rem", fontWeight: 600 }}>API Endpoints</h2>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {ENDPOINTS.map((ep, i) => {
            const tc = tagColor(ep.tag);
            return (
              <div key={i} style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.55rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: 4, background: tc.bg, color: tc.fg, letterSpacing: "0.05em" }}>{ep.tag}</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: C.text }}>{ep.path}</span>
                <span style={{ fontSize: "0.8rem", color: C.muted, flex: 1, minWidth: 150 }}>{ep.desc}</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: C.accent, fontWeight: 700 }}>{ep.price}</span>
              </div>
            );
          })}
          <div style={{ fontSize: "0.7rem", color: C.muted, marginTop: "0.5rem" }}>+ 15 more endpoints. See /openapi.json for full spec.</div>
        </div>
      </div>

      {/* Playground */}
      <div style={{ padding: "0 2rem 3rem", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: C.muted, marginBottom: "1rem", fontWeight: 600 }}>Playground</h2>
        <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 12, padding: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="/api/popular" style={{ flex: 1, background: C.bg, border: "1px solid " + C.border, borderRadius: 8, padding: "0.7rem 1rem", color: C.text, fontFamily: "monospace", fontSize: "0.85rem", outline: "none" }} />
            <button onClick={run} style={{ background: C.accent, color: "#000", border: "none", borderRadius: 8, padding: "0.7rem 1.5rem", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}>{load ? "..." : "Run"}</button>
          </div>
          {out && <pre style={{ background: C.bg, border: "1px solid " + C.border, borderRadius: 8, padding: "1rem", marginTop: "1rem", fontSize: "0.75rem", color: C.muted, overflow: "auto", maxHeight: 300 }}>{out}</pre>}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto", borderTop: "1px solid " + C.border, display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: C.muted }}>
        <span>Powered by <a href="https://fred.stlouisfed.org" style={{ color: C.accent, textDecoration: "none" }}>FRED</a> — Federal Reserve Bank of St. Louis</span>
        <span>x402 — Base Mainnet — USDC</span>
      </div>
    </div>
  );
}
