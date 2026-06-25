// Fathom — Custom x402 middleware
// Returns 402 with IETF Payment challenge + x402 v2 body
// Wallet: 0x0570cf2c24b14602c0c35f1d85192f6f0a12ed86

import { NextRequest, NextResponse } from "next/server";


const PAYEE = process.env.PAY_TO_ADDRESS || "0x0570cf2c24b14602c0c35f1d85192f6f0a12ed86";
const NETWORK = process.env.NETWORK || "eip155:8453";
const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://facilitator.payai.network";
const USDC_ASSET = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const CHALLENGE_SECRET = process.env.CHALLENGE_SECRET || "fathom-x402-challenge-secret";

const ROUTES: Record<string, { price: string; description: string }> = {
  "/api/observations": { price: "0.06", description: "Get economic data observations for any FRED series" },
  "/api/search": { price: "0.06", description: "Search 816,000+ FRED economic time series" },
  "/api/series": { price: "0.06", description: "Get FRED series metadata" },
  "/api/categories": { price: "0.04", description: "Browse FRED data categories" },
  "/api/popular": { price: "0.04", description: "20 most-watched macroeconomic indicators" },
  "/api/releases": { price: "0.06", description: "Federal Reserve data release schedule" },
  "/api/category-series": { price: "0.06", description: "Series within a FRED category" },
  "/api/tags": { price: "0.04", description: "Browse FRED data tags" },
  "/api/tag-series": { price: "0.06", description: "Series matching a tag" },
  "/api/release-series": { price: "0.06", description: "Series within a data release" },
  "/api/release-dates": { price: "0.06", description: "Release dates for a FRED release" },
  "/api/bulk": { price: "0.15", description: "Multi-series fetch in one call" },
  "/api/compare": { price: "0.15", description: "Compare 2-5 series side by side" },
  "/api/latest": { price: "0.04", description: "Latest value for a FRED series" },
  "/api/calendar": { price: "0.08", description: "Economic release calendar" },
  "/api/snapshot": { price: "0.20", description: "Dashboard of 10 key US economic indicators" },
  "/api/sources": { price: "0.04", description: "FRED data sources list" },
  "/api/category-tags": { price: "0.04", description: "Tags for a FRED category" },
  "/api/series-tags": { price: "0.04", description: "Tags for a FRED series" },
  "/api/search-tags": { price: "0.04", description: "Search FRED tags" },
  "/api/vintage": { price: "0.06", description: "Vintage/revision dates for a series" },
  "/api/related": { price: "0.04", description: "Related categories for a series" },
  "/api/category-tree": { price: "0.04", description: "Browse FRED category tree" },
};

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const BASE_URL = request.nextUrl.origin;
  const route = ROUTES[pathname];
  if (!route) return NextResponse.next();

  const paymentHeader = request.headers.get("Payment") || request.headers.get("X-Payment") || request.headers.get("payment-signature");

  if (paymentHeader) {
    try {
      const amountInBaseUnits = Math.round(parseFloat(route.price) * 1_000_000).toString();
      const requirements = {
        scheme: "exact",
        network: NETWORK,
        asset: USDC_ASSET,
        maxAmountRequired: amountInBaseUnits,
        resource: `${BASE_URL}${pathname}`,
        description: route.description,
        mimeType: "application/json",
        payTo: PAYEE,
        maxTimeoutSeconds: 60,
      };
      const verifyResp = await fetch(`${FACILITATOR_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentPayload: paymentHeader, paymentRequirements: requirements }),
      });
      if (verifyResp.ok) {
        const result = await verifyResp.json();
        if (result.isValid) {
          fetch(`${FACILITATOR_URL}/settle`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentPayload: paymentHeader, paymentRequirements: requirements }),
          }).catch(() => {});
          return NextResponse.next();
        }
      }
    } catch {
      // fall through to 402
    }
  }

  // Build 402 response
  const amountInBaseUnits = Math.round(parseFloat(route.price) * 1_000_000).toString();
  const host = BASE_URL.replace(/^https?:\/\//, "");

  // Generate challenge ID (HMAC-bound to parameters)
  const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const requestPayload = {
    scheme: "exact",
    network: NETWORK,
    asset: USDC_ASSET,
    amount: amountInBaseUnits,
    maxAmountRequired: amountInBaseUnits,
    resource: `${BASE_URL}${pathname}`,
    description: route.description,
    mimeType: "application/json",
    payTo: PAYEE,
    maxTimeoutSeconds: 60,
  };
  const requestB64 = base64url(Buffer.from(JSON.stringify(requestPayload)));

  // HMAC-SHA256 binding: id = HMAC(secret, method|intent|realm|request|expires)
  const bindingInput = `x402|charge|${host}|${requestB64}|${expires}`;
  // HMAC-SHA256 using Web Crypto API (Vercel edge compatible)
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(CHALLENGE_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(bindingInput));
  const challengeId = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 24);

  // IETF Payment challenge in WWW-Authenticate
  const wwwAuthenticate = `Payment id="${challengeId}", realm="${host}", method="x402", intent="charge", expires="${expires}", request="${requestB64}"`;

  // x402 v2 body (for x402scan compatibility)
  const acceptEntry = {
    scheme: "exact",
    network: NETWORK,
    asset: USDC_ASSET,
    amount: amountInBaseUnits,
    maxAmountRequired: amountInBaseUnits,
    resource: `${BASE_URL}${pathname}`,
    description: route.description,
    mimeType: "application/json",
    payTo: PAYEE,
    maxTimeoutSeconds: 60,
  };

  const x402v2Body = {
    x402Version: 2,
    accepts: [acceptEntry],
    paymentProtocol: "x402",
  };

  const paymentRequired = {
    x402Version: 2,
    accepts: [acceptEntry],
    resource: {
      url: `${BASE_URL}${pathname}`,
      description: route.description,
      mimeType: "application/json",
    },
  };

  const encodedPaymentRequired = Buffer.from(JSON.stringify(paymentRequired)).toString("base64");

  return new NextResponse(JSON.stringify(x402v2Body), {
    status: 402,
    headers: {
      "Content-Type": "application/json",
      "PAYMENT-REQUIRED": encodedPaymentRequired,
      "WWW-Authenticate": wwwAuthenticate,
    },
  });
}

export const config = { matcher: ["/api/:path*"] };
