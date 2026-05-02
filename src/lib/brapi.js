import { supabase } from "./supabase";

const BRAPI_TOKEN = "23JivkpZXLGb6uKbTK7uUU";
const BRAPI_BASE = "https://brapi.dev/api";
const CACHE_KEY = "comparai_brapi_live";
const CACHE_META_KEY = "comparai_brapi_live_meta";
const MAX_TICKERS = 20;
const CACHE_TIME_MS = 15 * 60 * 1000; // 15 minutos

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function isMarketHours() {
  const now = new Date();
  const day = now.getDay(); // 0=Dom, 6=Sáb
  if (day === 0 || day === 6) return false;
  const hour = now.getHours();
  return hour >= 10 && hour < 18; // pregão regular aproximado
}

function getCacheMeta() {
  if (!isBrowser()) return null;
  try {
    return JSON.parse(localStorage.getItem(CACHE_META_KEY));
  } catch {
    return null;
  }
}

function setCacheMeta(meta) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CACHE_META_KEY, JSON.stringify(meta));
  } catch {}
}

function isCacheFresh() {
  const meta = getCacheMeta();
  if (!meta?.updatedAt) return false;
  return Date.now() - Number(meta.updatedAt) < CACHE_TIME_MS;
}

export function getLiveCache() {
  if (!isBrowser()) return null;
  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (raw && typeof raw === "object") return raw;
  } catch {}
  return null;
}

function setLiveCache(data, tickers = []) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    setCacheMeta({
      updatedAt: Date.now(),
      updatedAtISO: new Date().toISOString(),
      tickers,
    });
  } catch {}
}

function normalizeTicker(ticker) {
  return String(ticker || "").trim().toUpperCase();
}

async function getTopTickers(extraTickers = []) {
  const extras = extraTickers.map(normalizeTicker).filter(Boolean);

  try {
    const { data } = await supabase.from("searches").select("ticker");
    const counts = {};

    extras.forEach((ticker) => {
      counts[ticker] = (counts[ticker] || 0) + 9999; // força ticker recém-pesquisado a entrar
    });

    if (data && data.length > 0) {
      data.forEach((s) => {
        const ticker = normalizeTicker(s.ticker);
        if (ticker) counts[ticker] = (counts[ticker] || 0) + 1;
      });
    }

    const tickers = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_TICKERS)
      .map(([ticker]) => ticker);

    return tickers.length ? tickers : null;
  } catch (e) {
    console.log("Failed to get top tickers:", e.message);
    return extras.length ? extras.slice(0, MAX_TICKERS) : null;
  }
}

async function fetchFromBrapi(tickers) {
  const cleanTickers = [...new Set((tickers || []).map(normalizeTicker).filter(Boolean))];
  if (!cleanTickers.length) return null;

  const tickerStr = cleanTickers.join(",");
  const res = await fetch(`${BRAPI_BASE}/quote/${tickerStr}?token=${BRAPI_TOKEN}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Brapi ${res.status}`);

  const json = await res.json();
  const data = {};

  if (json.results) {
    json.results.forEach((r) => {
      const symbol = normalizeTicker(r.symbol);
      if (!symbol) return;

      data[symbol] = {
        regularMarketPrice: r.regularMarketPrice,
        dividendYield: r.dividendYield,
        regularMarketChangePercent: r.regularMarketChangePercent,
        regularMarketTime: r.regularMarketTime,
        updatedAt: new Date().toISOString(),
      };
    });
  }

  return data;
}

// Atualiza em ciclos curtos durante pregão. Fora do pregão, usa cache.
export async function smartBrapiFetch(options = {}) {
  const { force = false, extraTickers = [] } = options;
  const cache = getLiveCache();

  if (!force && isCacheFresh()) return cache;
  if (!force && !isMarketHours()) return cache;

  const topTickers = await getTopTickers(extraTickers);
  if (!topTickers || topTickers.length === 0) return cache;

  try {
    const brapiData = await fetchFromBrapi(topTickers);
    if (brapiData && Object.keys(brapiData).length > 0) {
      const existing = cache || {};
      const merged = { ...existing, ...brapiData };
      setLiveCache(merged, topTickers);
      console.log(`Brapi: updated ${Object.keys(brapiData).length} tickers`);
      return merged;
    }
  } catch (e) {
    console.log("Brapi smart fetch failed:", e.message);
  }

  return cache;
}

export function mergeWithBrapi(mockDB, brapiData) {
  if (!brapiData) return mockDB;

  const merged = { ...mockDB };

  Object.entries(brapiData).forEach(([symbol, api]) => {
    if (merged[symbol]) {
      const next = { ...merged[symbol] };

      if (api.regularMarketPrice != null && api.regularMarketPrice > 0) {
        next.regularMarketPrice = api.regularMarketPrice;
      }

      if (api.dividendYield != null && api.dividendYield > 0) {
        next.dividendYield = api.dividendYield;
      }

      if (api.regularMarketChangePercent != null) {
        next.regularMarketChangePercent = api.regularMarketChangePercent;
      }

      next.brapiUpdatedAt = api.updatedAt || new Date().toISOString();
      merged[symbol] = next;
    }
  });

  return merged;
}
