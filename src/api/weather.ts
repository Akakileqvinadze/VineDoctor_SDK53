import * as Location from 'expo-location';
import { Forecast, HourlyPoint, DailyPoint } from '../types';

export async function getCurrentPosition(): Promise<{lat: number; lon: number} | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;
  const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { lat: loc.coords.latitude, lon: loc.coords.longitude };
}

export async function fetchForecast(lat: number, lon: number): Promise<Forecast> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    timezone: 'auto',
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation',
      'precipitation_probability',
      'wind_speed_10m'
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_mean',
      'rain_sum',
      'wind_speed_10m_max'
    ].join(',')
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('ამინდის ჩამოტვირთვისას მოხდა შეცდომა');
  const data = await res.json();

  const hourly: HourlyPoint[] = data.hourly.time.map((t: string, i: number) => ({
    time: t,
    temperature_2m: data.hourly.temperature_2m?.[i],
    relative_humidity_2m: data.hourly.relative_humidity_2m?.[i],
    precipitation: data.hourly.precipitation?.[i],
    precipitation_probability: data.hourly.precipitation_probability?.[i],
    wind_speed_10m: data.hourly.wind_speed_10m?.[i]
  }));

  const daily: DailyPoint[] = data.daily.time.map((d: string, i: number) => ({
    date: d,
    temperature_2m_max: data.daily.temperature_2m_max?.[i],
    temperature_2m_min: data.daily.temperature_2m_min?.[i],
    precipitation_probability_mean: data.daily.precipitation_probability_mean?.[i],
    rain_sum: data.daily.rain_sum?.[i],
    wind_speed_10m_max: data.daily.wind_speed_10m_max?.[i]
  }));

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    hourly,
    daily,
    fetchedAt: new Date().toISOString()
  };
}
