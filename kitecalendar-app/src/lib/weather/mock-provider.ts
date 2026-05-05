import { addDays, formatISO, parseISO } from "date-fns";
import type { ForecastDay, ForecastSummary, KiteRating } from "@/lib/types";
import { isWithinNextDays } from "@/lib/utils";
import type { WeatherProvider } from "@/lib/weather/types";

const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export const mockWeatherProvider: WeatherProvider = {
  name: "Mock wind model",
  async getForecast(event) {
    if (!isWithinNextDays(event.startDate, 7)) return undefined;

    const start = parseISO(event.startDate);
    const days: ForecastDay[] = Array.from({ length: 3 }).map((_, index) => {
      const seed = hash(`${event.id}-${index}`);
      const averageKnots = 10 + (seed % 19);
      const gustKnots = averageKnots + 5 + (seed % 8);
      const rating = rateWind(averageKnots, gustKnots);

      return {
        date: formatISO(addDays(start, index), { representation: "date" }),
        averageKnots,
        gustKnots,
        direction: directions[seed % directions.length],
        rating,
      };
    });

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

function hash(value: string) {
  let output = 0;
  for (let index = 0; index < value.length; index += 1) {
    output = (output << 5) - output + value.charCodeAt(index);
    output |= 0;
  }
  return Math.abs(output);
}

function rateWind(averageKnots: number, gustKnots: number): KiteRating {
  if (averageKnots >= 22 && gustKnots >= 30) return "Epic";
  if (averageKnots >= 17) return "Good";
  if (averageKnots >= 12) return "Okay";
  return "Poor";
}

function scoreRating(rating: KiteRating) {
  return { Poor: 0, Okay: 1, Good: 2, Epic: 3 }[rating];
}
