1|// Fathom — x402 payment proxy
2|// Wallet: 0x0570cf2c24b14602c0c35f1d85192f6f0a12ed86
3|// Chain: Base Mainnet (eip155:8453)
4|// Facilitator: PayAI
5|
6|import { paymentProxy } from "@x402/next";
7|import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
8|import { ExactEvmScheme } from "@x402/evm/exact/server";
9|
10|const WALLET_ADDRESS = process.env.PAY_TO_ADDRESS || "0x0570cf2c24b14602c0c35f1d85192f6f0a12ed86";
11|const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://facilitator.payai.network";
12|const NETWORK = (process.env.NETWORK || "eip155:8453") as "eip155:8453";
13|
14|const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
15|const server = new x402ResourceServer(facilitatorClient);
16|server.register(NETWORK, new ExactEvmScheme());
17|
18|export const proxy = paymentProxy(
19|{
20|  "/api/observations": {
21|    accepts: [{ scheme: "exact", price: "$0.03", network: NETWORK, payTo: WALLET_ADDRESS }],
22|    description: "Fetch data values for any FRED economic series. Use series IDs like GDP, UNRATE, CPIAUCSL, FEDFUNDS, DGS10.",
23|    mimeType: "application/json",
24|  },
25|  "/api/search": {
26|    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
27|    description: "Search across 816,000+ FRED economic time series by keyword.",
28|    mimeType: "application/json",
29|  },
30|  "/api/series": {
31|    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
32|    description: "Get detailed metadata for a specific FRED series: title, units, frequency, date range, popularity.",
33|    mimeType: "application/json",
34|  },
35|  "/api/categories": {
36|    accepts: [{ scheme: "exact", price: "$0.02", network: NETWORK, payTo: WALLET_ADDRESS }],
37|    description: "Browse FRED data categories: National Accounts, Prices, Employment, Money & Banking, etc.",
38|    mimeType: "application/json",
39|  },
40|  "/api/popular": {
41|    accepts: [{ scheme: "exact", price: "$0.02", network: NETWORK, payTo: WALLET_ADDRESS }],
42|    description: "20 most-watched macroeconomic indicators with FRED series IDs, names, and units.",
43|    mimeType: "application/json",
44|  },
45|  "/api/releases": {
46|    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
47|    description: "Upcoming Federal Reserve economic data releases.",
48|    mimeType: "application/json",
49|  },
50|  "/api/category-series": {
51|    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
52|    description: "List economic data series within a specific FRED category, sorted by popularity.",
53|    mimeType: "application/json",
54|  },
55|  "/api/tags": {
56|    accepts: [{ scheme: "exact", price: "$0.02", network: NETWORK, payTo: WALLET_ADDRESS }],
57|    description: "Browse all FRED tags. Tags describe data attributes like 'monthly', 'gdp', 'inflation', 'nsa'.",
58|    mimeType: "application/json",
59|  },
60|  "/api/tag-series": {
61|    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
62|    description: "Find economic data series matching a specific tag (e.g. 'gdp', 'monthly', 'inflation').",
63|    mimeType: "application/json",
64|  },
65|  "/api/release-series": {
66|    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
67|    description: "List all economic data series within a specific FRED data release.",
68|    mimeType: "application/json",
69|  },
70|  "/api/release-dates": {
71|    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
72|    description: "Get specific release dates for a FRED data release.",
73|    mimeType: "application/json",
74|  },
75|  "/api/bulk": {
76|    accepts: [{ scheme: "exact", price: "$0.05", network: NETWORK, payTo: WALLET_ADDRESS }],
77|    description: "Fetch observations for multiple FRED series in one call. Returns latest values for each.",
78|    mimeType: "application/json",
79|  },
80|  "/api/compare": {
81|    accepts: [{ scheme: "exact", price: "$0.05", network: NETWORK, payTo: WALLET_ADDRESS }],
82|    description: "Compare 2-5 economic series side by side with latest values and recent trends.",
83|    mimeType: "application/json",
84|  },
85|  "/api/latest": {
86|    accepts: [{ scheme: "exact", price: "$0.02", network: NETWORK, payTo: WALLET_ADDRESS }],
87|    description: "Get the most recent observation value for a FRED series.",
88|    mimeType: "application/json",
89|  },
90|  "/api/calendar": {
91|    accepts: [{ scheme: "exact", price: "$0.03", network: NETWORK, payTo: WALLET_ADDRESS }],
92|    description: "Upcoming economic data release calendar with dates and release names.",
93|    mimeType: "application/json",
94|  },
95|  "/api/snapshot": {
96|    accepts: [{ scheme: "exact", price: "$0.05", network: NETWORK, payTo: WALLET_ADDRESS }],
97|    description: "Dashboard snapshot of key US economic indicators: GDP, unemployment, CPI, Fed Funds rate, 10Y Treasury, S&P 500.",
98|    mimeType: "application/json",
99|  },
100|  "/api/sources": {
101|    accepts: [{ scheme: "exact", price: "$0.02", network: NETWORK, payTo: WALLET_ADDRESS }],
102|    description: "List all FRED data sources (Federal Reserve, BLS, Census, BEA, etc.).",
103|    mimeType: "application/json",
104|  },
105|  "/api/category-tags": {
106|    accepts: [{ scheme: "exact", price: "$0.02", network: NETWORK, payTo: WALLET_ADDRESS }],
107|    description: "Get all tags associated with a FRED data category.",
108|    mimeType: "application/json",
109|  },
110|  "/api/series-tags": {
111|    accepts: [{ scheme: "exact", price: "$0.02", network: NETWORK, payTo: WALLET_ADDRESS }],
112|    description: "Get all tags associated with a specific FRED series.",
113|    mimeType: "application/json",
114|  },
115|  "/api/search-tags": {
116|    accepts: [{ scheme: "exact", price: "$0.02", network: NETWORK, payTo: WALLET_ADDRESS }],
117|    description: "Search FRED tags by keyword.",
118|    mimeType: "application/json",
119|  },
120|  "/api/vintage": {
121|    accepts: [{ scheme: "exact", price: "$0.04", network: NETWORK, payTo: WALLET_ADDRESS }],
122|    description: "Get vintage/revision dates for a FRED series. Shows when data was revised.",
123|    mimeType: "application/json",
124|  },
125|  "/api/related": {
126|    accepts: [{ scheme: "exact", price: "$0.02", network: NETWORK, payTo: WALLET_ADDRESS }],
127|    description: "Get categories related to a specific FRED economic data series.",
128|    mimeType: "application/json",
129|  },
130|  "/api/category-tree": {
131|    accepts: [{ scheme: "exact", price: "$0.02", network: NETWORK, payTo: WALLET_ADDRESS }],
132|    description: "Get child categories for a parent FRED category. Walk the category tree.",
133|    mimeType: "application/json",
134|  }
135|},
136|  server
137|);
138|
139|export const config = { matcher: ["/api/:path*"] };