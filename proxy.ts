// Fathom — x402 payment proxy
// Wallet: Orbonomy unified (0xe53cf11c367390122af3431b7c47d323f9ccbf38)
// Chain: Base Mainnet (eip155:8453)
// Facilitator: PayAI

import { paymentProxy } from "@x402/next";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";

const WALLET_ADDRESS = process.env.PAY_TO_ADDRESS || "0xe53cf11c367390122af3431b7c47d323f9ccbf38";
const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://facilitator.payai.network";
const NETWORK = (process.env.NETWORK || "eip155:8453") as "eip155:8453";

const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
const server = new x402ResourceServer(facilitatorClient);
server.register(NETWORK, new ExactEvmScheme());

export const proxy = paymentProxy(
  {
    "/api/observations": {
      accepts: [{ scheme: "exact", price: "$0.03", network: NETWORK, payTo: WALLET_ADDRESS }],
      description: "Get economic data observations for any FRED series (GDP, CPI, unemployment, etc.)",
      mimeType: "application/json",
    },
    "/api/search": {
      accepts: [{ scheme: "exact", price: "$0.02", network: NETWORK, payTo: WALLET_ADDRESS }],
      description: "Search 816,000+ FRED economic time series by keyword",
      mimeType: "application/json",
    },
    "/api/series": {
      accepts: [{ scheme: "exact", price: "$0.02", network: NETWORK, payTo: WALLET_ADDRESS }],
      description: "Get metadata for a specific FRED economic data series",
      mimeType: "application/json",
    },
    "/api/categories": {
      accepts: [{ scheme: "exact", price: "$0.01", network: NETWORK, payTo: WALLET_ADDRESS }],
      description: "Browse FRED data categories (national accounts, prices, employment, etc.)",
      mimeType: "application/json",
    },
    "/api/popular": {
      accepts: [{ scheme: "exact", price: "$0.01", network: NETWORK, payTo: WALLET_ADDRESS }],
      description: "List 20 most-watched macroeconomic indicators with FRED series IDs",
      mimeType: "application/json",
    },
    "/api/releases": {
      accepts: [{ scheme: "exact", price: "$0.02", network: NETWORK, payTo: WALLET_ADDRESS }],
      description: "Upcoming Federal Reserve economic data release schedule",
      mimeType: "application/json",
    },
  },
  server
);

export const config = { matcher: ["/api/:path*"] };
