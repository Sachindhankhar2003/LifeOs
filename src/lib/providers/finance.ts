/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCached, setCached } from "./cache";

interface ExchangeRateResult {
  base_code: string;
  conversion_rates: Record<string, number>;
}

// Free open exchangerate API
export async function getExchangeRates(baseCurrency: string = "USD"): Promise<{
  data: ExchangeRateResult | null;
  source: string;
  metadata: { timestamp: string };
  error?: string;
}> {
  const cacheKey = `exchange_rate_${baseCurrency.toUpperCase()}`;
  const cached = getCached<ExchangeRateResult>(cacheKey, 1000 * 60 * 60 * 12); // 12 hours cache

  if (cached) {
    return {
      data: cached.data,
      source: cached.source,
      metadata: { timestamp: new Date(cached.timestamp).toISOString() },
    };
  }

  try {
    // Open Exchange Rates uses open_er-api or similar free variations
    const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency.toUpperCase()}`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch exchange rates for ${baseCurrency}`);
    }

    const json = await res.json();
    
    if (json.result !== "success") {
       throw new Error(json.error || "Currency fetch failed");
    }

    const data: ExchangeRateResult = {
      base_code: json.base_code,
      conversion_rates: json.rates || {},
    };

    setCached(cacheKey, data, "Open Exchange Rates");

    return {
      data,
      source: "Open Exchange Rates",
      metadata: { timestamp: new Date().toISOString() },
    };
  } catch (error: any) {
    console.error("Provider Error (Finance):", error);
    return {
      data: null,
      source: "Open Exchange Rates (Free API)",
      metadata: { timestamp: new Date().toISOString() },
      error: "Exchange rate data currently unavailable."
    };
  }
}
