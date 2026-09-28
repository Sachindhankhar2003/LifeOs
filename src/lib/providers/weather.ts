import { getCached, setCached } from "./cache";

interface WeatherResult {
  temperature_2m: number;
  apparent_temperature: number;
  precipitation_probability: number;
  wind_speed_10m: number;
  weathercode: number;
}

// Open-Meteo provides free, no-API-key weather data
export async function getLocalWeather(latitude: number, longitude: number): Promise<{
  data: WeatherResult | null;
  source: string;
  metadata: { timestamp: string };
  error?: string;
}> {
  const cacheKey = `weather_${latitude}_${longitude}`;
  const cached = getCached<WeatherResult>(cacheKey, 1000 * 60 * 60);

  if (cached) {
    return {
      data: cached.data,
      source: cached.source,
      metadata: { timestamp: new Date(cached.timestamp).toISOString() },
    };
  }

  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&forecast_days=1`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const json = await res.json();
    const data: WeatherResult = {
      temperature_2m: json.current.temperature_2m,
      apparent_temperature: json.current.apparent_temperature,
      precipitation_probability: json.current.precipitation || 0,
      wind_speed_10m: json.current.wind_speed_10m,
      weathercode: json.current.weather_code,
    };

    setCached(cacheKey, data, "Open-Meteo");

    return {
      data,
      source: "Open-Meteo",
      metadata: { timestamp: new Date().toISOString() },
    };
  } catch (error: any) {
    console.error("Provider Error (Weather):", error);
    return {
      data: null,
      source: "Open-Meteo",
      metadata: { timestamp: new Date().toISOString() },
      error: "Weather data currently unavailable."
    };
  }
}
