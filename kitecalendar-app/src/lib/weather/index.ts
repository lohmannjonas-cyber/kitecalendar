import type { KiteEvent } from "@/lib/types";
import { mockWeatherProvider } from "@/lib/weather/mock-provider";
import { openMeteoWeatherProvider } from "@/lib/weather/open-meteo-provider";
import type { WeatherProvider } from "@/lib/weather/types";

const providers: Record<string, WeatherProvider> = {
  mock: mockWeatherProvider,
  "open-meteo": openMeteoWeatherProvider,
  openmeteo: openMeteoWeatherProvider,
};

export function getWeatherProvider() {
  const providerKey = process.env.WEATHER_PROVIDER ?? "mock";
  return providers[providerKey] ?? mockWeatherProvider;
}

export async function getForecastForEvent(event: KiteEvent) {
  return getWeatherProvider().getForecast(event);
}

/*
  To connect a real weather API:
  1. Add a provider implementing WeatherProvider in this folder.
  2. Normalize provider-specific wind speeds to knots.
  3. Add it to the providers map above.
  4. Set WEATHER_PROVIDER in the environment. Open-Meteo does not need a key for basic use.
*/
