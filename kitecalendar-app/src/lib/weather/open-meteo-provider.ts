import { addDays, formatISO, parseISO } from "date-fns";
import type { ForecastDay, ForecastSummary } from "@/lib/types";
import { isWithinNextDays } from "@/lib/utils";
import { degreesToCompass, rateWind, scoreRating } from "@/lib/weather/rating";
import type { WeatherProvider } from "@/lib/weather/types";

type OpenMeteoDailyResponse = {
  daily?: {
    time?: string[];
    wind_speed_10m_mean?: number[];
    wind_gusts_10m_max?: number[];
    wind_direction_10m_dominant?: number[];
  };
};

export const openMeteoWeatherProvider: WeatherProvider = {
  name: "Open-Meteo",
  async getForecast(event) {
    if (!isWithinNextDays(event.startDate, 7)) return undefined;

    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(event.latitude));
    url.searchParams.set("longitude", String(event.longitude));
    url.searchParams.set(
      "daily",
      "wind_speed_10m_mean,wind_gusts_10m_max,wind_direction_10m_dominant",
    );
    url.searchParams.set("wind_speed_unit", "kn");
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("forecast_days", "7");

    const response = await fetch(url, {
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo forecast failed: ${response.status}`);
    }

    const payload = (await response.json()) as OpenMeteoDailyResponse;
    const daily = payload.daily;
    if (!daily?.time?.length) return undefined;

    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    const days: ForecastDay[] = daily.time
      .map((date, index) => {
        const averageKnots = Math.round(daily.wind_speed_10m_mean?.[index] ?? 0);
        const gustKnots = Math.round(daily.wind_gusts_10m_max?.[index] ?? averageKnots);
        const direction = degreesToCompass(daily.wind_direction_10m_dominant?.[index] ?? 0);

        return {
          date,
          averageKnots,
          gustKnots,
          direction,
          rating: rateWind(averageKnots, gustKnots),
        };
      })
      .filter((day) => {
        const dayDate = parseISO(day.date);
        return dayDate >= startOfForecastDay(eventStart) && dayDate <= startOfForecastDay(addDays(eventEnd, 1));
      })
      .slice(0, 4);

    if (!days.length) return undefined;

    const bestDay = [...days].sort((a, b) => scoreRating(b.rating) - scoreRating(a.rating) || b.gustKnots - a.gustKnots)[0];
    const averageKnots = Math.round(days.reduce((sum, day) => sum + day.averageKnots, 0) / days.length);
    const gustKnots = Math.max(...days.map((day) => day.gustKnots));

    return {
      provider: this.name,
      averageKnots,
      gustKnots,
      direction: bestDay.direction,
      bestDay,
      rating: bestDay.rating,
      days,
      updatedAt: new Date().toISOString(),
    } satisfies ForecastSummary;
  },
};

function startOfForecastDay(date: Date) {
  return parseISO(formatISO(date, { representation: "date" }));
}
