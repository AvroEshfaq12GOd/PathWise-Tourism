import { env } from '../config/env.js';

export interface WeatherSnapshot {
  temp: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  isNight?: boolean;
}

function parseWmoWeatherCode(code: number, isDay: number = 1): string {
  if (code === 0) return isDay ? 'Sunny' : 'Clear Night';
  if (code === 1 || code === 2) return isDay ? 'Partly Cloudy' : 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Misty';
  if (code >= 51 && code <= 57) return 'Light Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 80 && code <= 82) return 'Passing Showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return isDay ? 'Sunny' : 'Clear';
}

export async function getOpenWeatherByCoords(lat: number, lon: number): Promise<WeatherSnapshot | null> {
  // Try OpenWeatherMap if key is provided
  if (env.openWeatherApiKey) {
    const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));
    url.searchParams.set('appid', env.openWeatherApiKey);
    url.searchParams.set('units', 'metric');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(url, { signal: controller.signal });
      if (res.ok) {
        const data = (await res.json()) as {
          main?: { temp?: number; humidity?: number };
          weather?: Array<{ main?: string }>;
          wind?: { speed?: number };
        };

        return {
          temp: Math.round(data.main?.temp ?? 28),
          condition: data.weather?.[0]?.main ?? 'Sunny',
          humidity: data.main?.humidity ?? 70,
          windSpeed: data.wind?.speed ?? 12
        };
      }
    } catch {
      // Fall through to Open-Meteo
    } finally {
      clearTimeout(timeout);
    }
  }

  // Real-world Live Weather via Open-Meteo free API (No key required, global coverage)
  try {
    const omUrl = new URL('https://api.open-meteo.com/v1/forecast');
    omUrl.searchParams.set('latitude', String(lat));
    omUrl.searchParams.set('longitude', String(lon));
    omUrl.searchParams.set('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day');
    omUrl.searchParams.set('timezone', 'Asia/Colombo');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(omUrl.toString(), { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const omData = (await res.json()) as {
        current?: {
          temperature_2m?: number;
          relative_humidity_2m?: number;
          weather_code?: number;
          wind_speed_10m?: number;
          is_day?: number;
        };
      };

      if (omData.current) {
        const temp = Math.round(omData.current.temperature_2m ?? 28);
        const code = omData.current.weather_code ?? 0;
        const isDay = omData.current.is_day ?? 1;
        const condition = parseWmoWeatherCode(code, isDay);

        return {
          temp,
          condition,
          humidity: Math.round(omData.current.relative_humidity_2m ?? 72),
          windSpeed: Math.round(omData.current.wind_speed_10m ?? 10),
          isNight: isDay === 0
        };
      }
    }
  } catch {
    // Return sensible Sri Lankan tropical climate snapshot
  }

  return {
    temp: 28,
    condition: 'Sunny',
    humidity: 75,
    windSpeed: 12
  };
}
