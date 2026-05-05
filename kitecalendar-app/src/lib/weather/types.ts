import type { ForecastSummary, KiteEvent } from "@/lib/types";

export type WeatherProvider = {
  name: string;
  getForecast(event: KiteEvent): Promise<ForecastSummary | undefined>;
};
