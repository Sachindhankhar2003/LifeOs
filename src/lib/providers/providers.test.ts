import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLocalWeather, getExchangeRates, getCached, setCached, clearCache } from './index';

// Mock fetch globally
global.fetch = vi.fn();

describe('Real-World Intelligence Providers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearCache();
  });

  describe('Weather Provider: Open-Meteo', () => {
    it('returns data when API succeeds', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 20,
            apparent_temperature: 21,
            precipitation: 0,
            wind_speed_10m: 10,
            weather_code: 1
          }
        })
      });

      const result = await getLocalWeather(40.7128, -74.0060);
      expect(result.data).toBeDefined();
      expect(result.data?.temperature_2m).toBe(20);
      expect(result.error).toBeUndefined();
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('returns error when API fails politely', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false
      });

      const result = await getLocalWeather(999, 999);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('handles timeouts gracefully', async () => {
      (fetch as any).mockRejectedValueOnce(new Error("Timeout"));

      const result = await getLocalWeather(40.7128, -74.0060);
      expect(result.data).toBeNull();
      expect(result.error).toBe("Weather data currently unavailable.");
    });
  });

  describe('Finance Provider: Open Exchange Rates', () => {
    it('returns data when API succeeds', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          result: "success",
          base_code: "USD",
          rates: { "EUR": 0.85 }
        })
      });

      const result = await getExchangeRates("USD");
      expect(result.data).toBeDefined();
      expect(result.data?.conversion_rates["EUR"]).toBe(0.85);
      expect(result.error).toBeUndefined();
    });

    it('handles malformed responses politely', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          result: "error",
          error: "unsupported-code"
        })
      });

      const result = await getExchangeRates("ZZZ");
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });
  });
});
