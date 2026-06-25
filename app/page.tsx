export default function Home() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem 2rem", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#0a0a0a", minHeight: "100vh", color: "#e0e0e0" }}>
      <h1 style={{ fontSize: "3.5rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "0.5rem", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Fathom</h1>
      <p style={{ fontSize: "1.15rem", color: "#888", marginBottom: "3rem", lineHeight: 1.6 }}>Free macroeconomic data API. 816,000+ time series from the Federal Reserve, wrapped in a clean REST interface.</p>
      <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem", flexWrap: "wrap" }}>
        <Stat val="816K+" label="Time Series" />
        <Stat val="120" label="Req / Min" />
        <Stat val="\/usr/bin/bash" label="Forever Free" />
      </div>
      <h2 style={{ fontSize: "1.3rem", color: "#999", marginBottom: "1rem" }}>Endpoints</h2>
      {[["GET", "/api/observations/{seriesId}", "Get data values"],["GET", "/api/search?q={query}", "Search 816K+ series"],["GET", "/api/series/{seriesId}", "Series metadata"],["GET", "/api/categories?id={id}", "Browse categories"],["GET", "/api/popular", "20 most-watched indicators"],["GET", "/api/releases", "Upcoming data releases"]].map(([m,p,d],i) => (
        <div key={i} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: 4, background: "#1a2f1a", color: "#4ade80" }}>{m}</span>
          <span style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "#ccc" }}>{p}</span>
          <span style={{ fontSize: "0.8rem", color: "#666", marginLeft: "auto" }}>{d}</span>
        </div>
      ))}
      <h2 style={{ fontSize: "1.3rem", color: "#999", margin: "2.5rem 0 1rem" }}>Popular Series</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.5rem", marginBottom: "2.5rem" }}>
        {[["gdp","Gross Domestic Product"],["unemployment","Unemployment Rate"],["cpi","Consumer Price Index"],["fedfunds","Federal Funds Rate"],["treasury10y","10-Year Treasury"],["sp500","S&P 500"],["m2","M2 Money Supply"],["gold","Gold Price"],["oil","Crude Oil WTI"],["vix","Volatility Index"]].map(([k,n],i) => (
          <div key={i} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 8, padding: "0.8rem 1rem" }}>
            <span style={{ color: "#60a5fa", fontFamily: "monospace", fontWeight: 600 }}>{k}</span>
            <div style={{ color: "#888", fontSize: "0.75rem", marginTop: "0.15rem" }}>{n}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid #1a1a1a", fontSize: "0.75rem", color: "#444", display: "flex", justifyContent: "space-between" }}>
        <span>Powered by <a href="https://fred.stlouisfed.org" style={{ color: "#60a5fa", textDecoration: "none" }}>FRED</a> - Federal Reserve Bank of St. Louis</span>
        <span>816,000+ economic time series</span>
      </div>
    </div>
  );
}

function Stat({ val, label }: { val: string; label: string }) {
  return (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: "1.5rem 2rem", minWidth: 160 }}>
      <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#60a5fa" }}>{val}</div>
      <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    </div>
  );
}
