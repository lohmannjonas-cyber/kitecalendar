import type { KiteRating } from "@/lib/types";

export function rateWind(averageKnots: number, gustKnots: number): KiteRating {
  if (averageKnots >= 22 && gustKnots >= 30) return "Epic";
  if (averageKnots >= 17) return "Good";
  if (averageKnots >= 12) return "Okay";
  return "Poor";
}

export function scoreRating(rating: KiteRating) {
  return { Poor: 0, Okay: 1, Good: 2, Epic: 3 }[rating];
}

export function degreesToCompass(degrees: number) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(degrees / 45) % directions.length];
}
