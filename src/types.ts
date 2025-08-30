export type HourlyPoint = {
  time: string; // ISO
  temperature_2m?: number;
  relative_humidity_2m?: number;
  precipitation?: number;
  precipitation_probability?: number;
  wind_speed_10m?: number;
};

export type DailyPoint = {
  date: string; // ISO date
  temperature_2m_max?: number;
  temperature_2m_min?: number;
  precipitation_probability_mean?: number;
  rain_sum?: number;
  wind_speed_10m_max?: number;
};

export type Forecast = {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  fetchedAt: string; // ISO
};
