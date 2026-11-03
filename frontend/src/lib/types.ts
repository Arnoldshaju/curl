export interface User {
  id: number;
  username: string;
  email: string;
  date_joined: string;
}

export interface ShortenedURL {
  id: string;
  original_url: string;
  short_code: string;
  custom_alias: string | null;
  effective_code: string;
  short_url: string;
  title: string;
  description: string;
  is_active: boolean;
  is_expired: boolean;
  expires_at: string | null;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ClickAnalyticsItem {
  id: string;
  clicked_at: string;
  referrer: string;
  referrer_domain: string;
  device_category: string;
  browser: string;
  os: string;
  country: string;
}

export interface AnalyticsSummary {
  total_clicks: number;
  clicks_by_device: { device_category: string; count: number }[];
  clicks_by_browser: { browser: string; count: number }[];
  clicks_by_referrer: { referrer_domain: string; count: number }[];
  clicks_over_time: { date: string; count: number }[];
  recent_clicks: ClickAnalyticsItem[];
}
