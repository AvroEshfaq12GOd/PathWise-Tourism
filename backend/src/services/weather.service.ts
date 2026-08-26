import { env } from '../config/env.js';

export interface WeatherSnapshot {
  temp: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
}

export async function getOpenWeatherByCoords(lat: number, lon: number): Promise<WeatherSnapshot | null> {
  if (!env.openWeatherApiKey) return null;

  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('appid', env.openWeatherApiKey);
  url.searchParams.set('units', 'metric');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      main?: { temp?: number; humidity?: number };
      weather?: Array<{ main?: string }>;
      wind?: { speed?: number };
    };

    return {
      temp: Math.round(data.main?.temp ?? 0),
      condition: data.weather?.[0]?.main ?? 'Unknown',
      humidity: data.main?.humidity,
      windSpeed: data.wind?.speed
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
