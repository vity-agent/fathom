import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fathom — Macroeconomic Data API",
  description: "Free macroeconomic data API powered by FRED. 816,000+ economic time series. GDP, inflation, unemployment, interest rates, and more.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0a0a0a" }}>{children}</body>
    </html>
  );
}
