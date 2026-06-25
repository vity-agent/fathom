// Fathom — x402 payment proxy
// Wallet: 0x0570cf2c24b14602c0c35f1d85192f6f0a12ed86
// Chain: Base Mainnet (eip155:8453)
// Facilitator: PayAI

import { paymentProxy } from "@x402/next";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";

const WALLET_ADDRESS = process.env.PAY_TO_ADDRESS || "0x0570cf2c24b14602c0c35f1d85192f6f0a12ed86";
const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://facilitator.payai.network";
const NETWORK = (process.env.NETWORK || "eip155:8453") as "eip155:8453";

const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
const server = new x402ResourceServer(facilitatorClient);
server.register(NETWORK, new ExactEvmScheme());

export const proxy = paymentProxy(
{
  "/api/observations": {
    accepts: [{ scheme: "exact", price: "$0.06", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Fetch data values for any FRED economic series. Use series IDs like GDP, UNRATE, CPIAUCSL, FEDFUNDS, DGS10.",
    mimeType: "application/json",
  },
  "/api/search": {
    accepts: [{ scheme: "exact", price: "$0.06", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Search across 816,000+ FRED economic time series by keyword.",
    mimeType: "application/json",
  },
  "/api/series": {
    accepts: [{ scheme: "exact", price: "$0.06", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Get detailed metadata for a specific FRED series: title, units, frequency, date range, popularity.",
    mimeType: "application/json",
  },
  "/api/categories": {
    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Browse FRED data categories: National Accounts, Prices, Employment, Money & Banking, etc.",
    mimeType: "application/json",
  },
  "/api/popular": {
    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "20 most-watched macroeconomic indicators with FRED series IDs, names, and units.",
    mimeType: "application/json",
  },
  "/api/releases": {
    accepts: [{ scheme: "exact", price: "$0.06", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Upcoming Federal Reserve economic data releases.",
    mimeType: "application/json",
  },
  "/api/category-series": {
    accepts: [{ scheme: "exact", price: "$0.06", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "List economic data series within a specific FRED category, sorted by popularity.",
    mimeType: "application/json",
  },
  "/api/tags": {
    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Browse all FRED tags. Tags describe data attributes like 'monthly', 'gdp', 'inflation', 'nsa'.",
    mimeType: "application/json",
  },
  "/api/tag-series": {
    accepts: [{ scheme: "exact", price: "$0.06", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Find economic data series matching a specific tag (e.g. 'gdp', 'monthly', 'inflation').",
    mimeType: "application/json",
  },
  "/api/release-series": {
    accepts: [{ scheme: "exact", price: "$0.06", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "List all economic data series within a specific FRED data release.",
    mimeType: "application/json",
  },
  "/api/release-dates": {
    accepts: [{ scheme: "exact", price: "$0.06", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Get specific release dates for a FRED data release.",
    mimeType: "application/json",
  },
  "/api/bulk": {
    accepts: [{ scheme: "exact", price: "$0.15", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Fetch observations for multiple FRED series in one call. Returns latest values for each.",
    mimeType: "application/json",
  },
  "/api/compare": {
    accepts: [{ scheme: "exact", price: "$0.15", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Compare 2-5 economic series side by side with latest values and recent trends.",
    mimeType: "application/json",
  },
  "/api/latest": {
    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Get the most recent observation value for a FRED series.",
    mimeType: "application/json",
  },
  "/api/calendar": {
    accepts: [{ scheme: "exact", price: "$0.08", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Upcoming economic data release calendar with dates and release names.",
    mimeType: "application/json",
  },
  "/api/snapshot": {
    accepts: [{ scheme: "exact", price: "$0.20", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Dashboard snapshot of key US economic indicators: GDP, unemployment, CPI, Fed Funds rate, 10Y Treasury, S&P 500.",
    mimeType: "application/json",
  },
  "/api/sources": {
    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "List all FRED data sources (Federal Reserve, BLS, Census, BEA, etc.).",
    mimeType: "application/json",
  },
  "/api/category-tags": {
    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Get all tags associated with a FRED data category.",
    mimeType: "application/json",
  },
  "/api/series-tags": {
    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Get all tags associated with a specific FRED series.",
    mimeType: "application/json",
  },
  "/api/search-tags": {
    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Search FRED tags by keyword.",
    mimeType: "application/json",
  },
  "/api/vintage": {
    accepts: [{ scheme: "exact", price: "$0.06", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Get vintage/revision dates for a FRED series. Shows when data was revised.",
    mimeType: "application/json",
  },
  "/api/related": {
    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Get categories related to a specific FRED economic data series.",
    mimeType: "application/json",
  },
  "/api/category-tree": {
    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
    description: "Get child categories for a parent FRED category. Walk the category tree.",
    mimeType: "application/json",
  }
},
  server
);

export const config = { matcher: ["/api/:path*"] };