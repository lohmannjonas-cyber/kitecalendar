export type ReviewStatus = "pending" | "approved" | "rejected" | "duplicate";
export type SourceType = "user_submitted" | "crawled" | "admin_created";

export type KiteRating = "Poor" | "Okay" | "Good" | "Epic";

export type Brand = {
  id: string;
  name: string;
  color: string;
  website?: string;
};

export type EventType = {
  id: string;
  slug: string;
  name: string;
  color: string;
};

export type ForecastDay = {
  date: string;
  averageKnots: number;
  gustKnots: number;
  direction: string;
  rating: KiteRating;
};

export type ForecastSummary = {
  provider: string;
  averageKnots: number;
  gustKnots: number;
  direction: string;
  bestDay: ForecastDay;
  rating: KiteRating;
  days: ForecastDay[];
  updatedAt: string;
};

export type KiteEvent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string;
  country: string;
  region?: string;
  city: string;
  spotName?: string;
  latitude: number;
  longitude: number;
  eventType: EventType;
  organizerName: string;
  organizerWebsite?: string;
  sourceUrl?: string;
  sourceType: SourceType;
  reviewStatus: ReviewStatus;
  brands: Brand[];
  featured?: boolean;
  forecast?: ForecastSummary;
  createdAt: string;
  updatedAt: string;
};

export type EventSubmission = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  country: string;
  region?: string;
  city: string;
  spotName?: string;
  latitude?: number;
  longitude?: number;
  eventTypeSlug: string;
  organizerName: string;
  organizerWebsite?: string;
  brandNames: string[];
  contactEmail: string;
  sourceUrl?: string;
  sourceType: SourceType;
  reviewStatus: ReviewStatus;
  duplicateOfId?: string;
  reviewerNote?: string;
  crawledAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type EventFilters = {
  q?: string;
  country?: string;
  region?: string;
  city?: string;
  datePreset?: "week" | "month" | "custom";
  start?: string;
  end?: string;
  eventType?: string;
  brand?: string;
  minWind?: number;
  windDirection?: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
};

export const WIND_DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
