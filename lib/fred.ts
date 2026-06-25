const FRED_BASE = "https://api.stlouisfed.org/fred";

function getKey() {
  return process.env.FRED_API_KEY || "";
}

export async function fredGet(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${FRED_BASE}/${endpoint}`);
  url.searchParams.set("api_key", getKey());
  url.searchParams.set("file_type", "json");
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`FRED API error: ${res.status}`);
  return res.json();
}

export async function getObservations(seriesId: string, opts: {
  sort_order?: string;
  limit?: string;
  observation_start?: string;
  observation_end?: string;
  units?: string;
  frequency?: string;
} = {}) {
  return fredGet("series/observations", {
    series_id: seriesId,
    sort_order: opts.sort_order || "desc",
    limit: opts.limit || "10",
    observation_start: opts.observation_start || "",
    observation_end: opts.observation_end || "",
    units: opts.units || "",
    frequency: opts.frequency || "",
  });
}

export async function searchSeries(query: string, limit: string = "10") {
  return fredGet("series/search", { search_text: query, limit, sort_order: "popularity" });
}

export async function getSeriesInfo(seriesId: string) {
  return fredGet("series", { series_id: seriesId });
}

export async function getCategories(categoryId: string = "0") {
  return fredGet("category/children", { category_id: categoryId });
}

export async function getCategorySeries(categoryId: string, limit: string = "20") {
  return fredGet("category/series", { category_id: categoryId, limit, sort_order: "popularity" });
}

export async function getReleases(limit: string = "20") {
  return fredGet("releases", { limit });
}

export async function getReleaseDates(limit: string = "10") {
  return fredGet("releases/dates", { limit });
}



export async function getTags(limit: string = "50", search: string = "") {
  const params: Record<string, string> = { limit };
  if (search) params.search_text = search;
  return fredGet("tags", params);
}

export async function getTagSeries(tag: string, limit: string = "20") {
  return fredGet("tags/series", { tag_names: tag, limit, sort_order: "popularity" });
}

export async function getReleaseSeries(releaseId: string, limit: string = "20") {
  return fredGet("release/series", { release_id: releaseId, limit });
}

export async function getReleaseDatesForRelease(releaseId: string, limit: string = "10") {
  return fredGet("release/dates", { release_id: releaseId, limit });
}

export async function getCategoryTags(categoryId: string) {
  return fredGet("category/tags", { category_id: categoryId });
}

export async function getSeriesTags(seriesId: string) {
  return fredGet("series/tags", { series_id: seriesId });
}

export async function searchTags(query: string, limit: string = "20") {
  return fredGet("series/search/tags", { search_text: query, limit });
}

export async function getRelatedSeries(seriesId: string) {
  return fredGet("series/categories", { series_id: seriesId });
}

export async function getSources() {
  return fredGet("sources", {});
}

export async function getVintageDates(seriesId: string, limit: string = "10") {
  return fredGet("series/vintagedates", { series_id: seriesId, limit });
}

export const POPULAR_SERIES: Record<string, { id: string; name: string; unit: string }> = {
  gdp: { id: "GDP", name: "Gross Domestic Product", unit: "Billions of Dollars" },
  unemployment: { id: "UNRATE", name: "Unemployment Rate", unit: "Percent" },
  cpi: { id: "CPIAUCSL", name: "Consumer Price Index", unit: "Index" },
  inflation: { id: "FPCPITOTLZGUSA", name: "Inflation Rate", unit: "Percent" },
  fedfunds: { id: "FEDFUNDS", name: "Federal Funds Rate", unit: "Percent" },
  treasury10y: { id: "DGS10", name: "10-Year Treasury Rate", unit: "Percent" },
  treasury2y: { id: "DGS2", name: "2-Year Treasury Rate", unit: "Percent" },
  m2: { id: "M2SL", name: "M2 Money Supply", unit: "Billions of Dollars" },
  sp500: { id: "SP500", name: "S&P 500", unit: "Index" },
  sentiment: { id: "UMCSENT", name: "Consumer Sentiment", unit: "Index" },
  housing: { id: "HOUST", name: "Housing Starts", unit: "Thousands of Units" },
  claims: { id: "ICSA", name: "Initial Jobless Claims", unit: "Claims" },
  pce: { id: "PCE", name: "Personal Consumption Expenditures", unit: "Billions of Dollars" },
  indpro: { id: "INDPRO", name: "Industrial Production Index", unit: "Index" },
  retail: { id: "RSAFS", name: "Retail Sales", unit: "Millions of Dollars" },
  yield_spread: { id: "T10Y2Y", name: "10Y-2Y Treasury Spread", unit: "Percent" },
  vix: { id: "VIXCLS", name: "CBOE Volatility Index", unit: "Index" },
  gold: { id: "GOLDAMGBD228NLBM", name: "Gold Price London Fix", unit: "USD" },
  oil: { id: "DCOILWTICO", name: "Crude Oil WTI", unit: "USD per Barrel" },
  dollar: { id: "DTWEXBGS", name: "Trade Weighted US Dollar Index", unit: "Index" },
};
