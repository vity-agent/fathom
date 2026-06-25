// Fathom — Custom x402 middleware
// Returns 402 with x402 v2 JSON body + PAYMENT-REQUIRED header for all paid routes
// Wallet: 0x0570cf2c24b14602c0c35f1d85192f6f0a12ed86

import { NextRequest, NextResponse } from "next/server";

// BASE_URL derived from request in handler
const PAYEE = process.env.PAY_TO_ADDRESS || "0x0570cf2c24b14602c0c35f1d85192f6f0a12ed86";
const NETWORK = process.env.NETWORK || "eip155:8453";
const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://facilitator.payai.network";
const USDC_ASSET = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const BASE_URL = request.nextUrl.origin;
  const route = ROUTES[pathname];
  if (!route) return NextResponse.next();

  // Check for payment header (x402 v2)
  const paymentHeader = request.headers.get("Payment") || request.headers.get("X-Payment") || request.headers.get("payment-signature");

  if (paymentHeader) {
    // Verify payment with facilitator
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
          // Settle in background
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

  // No valid payment — return 402 with x402 v2 body + PAYMENT-REQUIRED header
  const amountInBaseUnits = Math.round(parseFloat(route.price) * 1_000_000).toString();
  const host = BASE_URL.replace(/^https?:\/\//, "");

  // Build payment requirements for PAYMENT-REQUIRED header (base64-encoded)
  const paymentRequired = {
    x402Version: 2,
    accepts: [{
      scheme: "exact",
      network: NETWORK,
      asset: USDC_ASSET,
      maxAmountRequired: amountInBaseUnits,
      resource: `${BASE_URL}${pathname}`,
      description: route.description,
      mimeType: "application/json",
      payTo: PAYEE,
      maxTimeoutSeconds: 60,
    }],
    resource: {
      url: `${BASE_URL}${pathname}`,
      description: route.description,
      mimeType: "application/json",
    },
  };

  const x402v2Body = {
    x402Version: 2,
    accepts: paymentRequired.accepts,
    paymentProtocol: "x402",
  };

  // Base64-encode for PAYMENT-REQUIRED header
  const encodedPaymentRequired = Buffer.from(JSON.stringify(paymentRequired)).toString("base64");

  return new NextResponse(JSON.stringify(x402v2Body), {
    status: 402,
    headers: {
      "Content-Type": "application/json",
      "PAYMENT-REQUIRED": encodedPaymentRequired,
      "X-Payment-Required": amountInBaseUnits,
      "X-Payment-Network": NETWORK,
      "X-Payment-Asset": USDC_ASSET,
      "X-Payment-PayTo": PAYEE,
      "X-Payment-Resource": `${BASE_URL}${pathname}`,
      "WWW-Authenticate": `x402 realm="${host}", version="2", network="${NETWORK}", asset="${USDC_ASSET}", payee="${PAYEE}", amount="${amountInBaseUnits}", resource="${pathname}"`,
    },
  });
}

export const config = { matcher: ["/api/:path*"] };
