const BRAPI_TOKEN = "23JivkpZXLGb6uKbTK7uUU";
const BRAPI_BASE = "https://brapi.dev/api";
const CACHE_KEY_ACOES = "comparai_brapi_acoes";
const CACHE_KEY_FIIS = "comparai_brapi_fiis";
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours

function getCache(key) {
  try {
    const raw = JSON.parse(localStorage.getItem(key));
    if (raw && raw.timestamp && Date.now() - raw.timestamp < CACHE_DURATION) {
      return raw.data;
    }
  } catch {}
  return null;
}

function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

export async function fetchBrapiQuotes(tickers, cacheKey) {
  // 1. Try cache first
  const cached = getCache(cacheKey);
  if (cached) return cached;

  // 2. Try API
  try {
    const tickerStr = tickers.join(",");
    const res = await fetch(`${BRAPI_BASE}/quote/${tickerStr}?token=${BRAPI_TOKEN}`);
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    if (json.results && json.results.length > 0) {
      const data = {};
      json.results.forEach((r) => {
        data[r.symbol] = {
          regularMarketPrice: r.regularMarketPrice,
          priceToBook: r.priceToBook,
          priceEarnings: r.priceEarnings,
          dividendYield: r.dividendYield,
          roe: r.returnOnEquity,
        };
      });
      setCache(cacheKey, data);
      return data;
    }
  } catch (e) {
    console.log("Brapi fetch failed, using cache/mock:", e.message);
  }

  // 3. Try stale cache (even if expired)
  try {
    const raw = JSON.parse(localStorage.getItem(cacheKey));
    if (raw?.data) return raw.data;
  } catch {}

  // 4. Return null (will use mock)
  return null;
}

export const ACOES_TICKERS = [
  "PETR4", "VALE3", "ITUB4", "BBAS3", "SANB11", "BBDC4", "ITSA4", "BPAC11",
  "ABCB4", "WEGE3", "MGLU3", "ABEV3", "RENT3", "JBSS3", "LREN3", "ARZZ3",
  "TAEE11", "CMIG4", "ELET3", "EGIE3", "CPFE3", "SUZB3", "CSNA3", "GGBR4",
  "FLRY3", "HAPV3", "RDOR3", "TOTS3", "VIVT3", "TIMS3"
];

export const FIIS_TICKERS = [
  "HGLG11", "BTLG11", "XPLG11", "VILG11", "LVBI11", "BRCO11",
  "XPML11", "VISC11", "HSML11", "MALL11",
  "KNRI11", "HGRE11", "BRCR11", "PVBI11", "VINO11",
  "TRXF11", "HGRU11", "RBVA11",
  "MXRF11", "KNCR11", "KNIP11", "IRDM11", "CPTS11", "RBRR11", "RECR11",
  "KNCA11", "RZAG11",
  "BCFF11", "HFOF11", "RBRF11", "MGFF11"
];

export { CACHE_KEY_ACOES, CACHE_KEY_FIIS };
