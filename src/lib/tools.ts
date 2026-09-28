import { tool } from "ai";
import { z } from "zod";
import { getLocalWeather, getExchangeRates } from "./providers";

export const aiTools = {
  getWeather: tool({
    description: "Get the current weather and forecast for any global location (using Open-Meteo free API). Use to answer questions about climate, weather conditions, packing for trips, or local outdoor activities.",
    parameters: z.object({
      latitude: z.number().describe("Latitude of the location"),
      longitude: z.number().describe("Longitude of the location"),
      locationName: z.string().optional().describe("Human readable location name for context"),
    }),
    execute: async ({ latitude, longitude, locationName }) => {
      const result = await getLocalWeather(latitude, longitude);
      return {
        location: locationName || `${latitude}, ${longitude}`,
        ...result,
      };
    },
  }),

  getExchangeRates: tool({
    description: "Get currency exchange rates for a base currency (using open.er-api.com). Use to help with travel budgeting, financial planning, or international cost conversions.",
    parameters: z.object({
      baseCurrency: z.string().describe("3-letter ISO currency code, e.g., 'USD' or 'EUR'"),
    }),
    execute: async ({ baseCurrency }) => {
      const result = await getExchangeRates(baseCurrency);
      return result;
    }
  }),
};
