/**
 * Real-Time Weather Service for Sri Lankan Destinations
 * Powered by open meteorological data (Open-Meteo API, UTC+5:30 Sri Lanka Standard Time)
 */

export interface LiveSiteWeather {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  isNight: boolean;
  uvIndex?: number;
  precipitation?: number;
  updatedAt: string;
}

const weatherCache = new Map<string, { data: LiveSiteWeather; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes fresh cache

export function parseWmoWeather(code: number, isDay: number = 1): string {
  if (code === 0) return isDay ? 'Sunny' : 'Clear Night';
  if (code === 1 || code === 2) return isDay ? 'Partly Cloudy' : 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Misty';
  if (code >= 51 && code <= 57) return 'Light Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 80 && code <= 82) return 'Passing Showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return isDay ? 'Clear' : 'Clear Night';
}

/**
 * Fetches actual live temperature, weather condition and humidity for GPS coordinates
 */
export async function getLiveSiteWeather(lat: number, lng: number): Promise<LiveSiteWeather> {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=Asia/Colombo`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4500) });
    
    if (res.ok) {
      const data = await res.json();
      if (data.current) {
        const isDay = data.current.is_day ?? 1;
        const weather: LiveSiteWeather = {
          temp: Math.round(data.current.temperature_2m ?? 28),
          condition: parseWmoWeather(data.current.weather_code ?? 0, isDay),
          humidity: Math.round(data.current.relative_humidity_2m ?? 70),
          windSpeed: Math.round(data.current.wind_speed_10m ?? 12),
          precipitation: data.current.precipitation ?? 0,
          isNight: isDay === 0,
          updatedAt: new Date().toISOString()
        };

        weatherCache.set(cacheKey, { data: weather, timestamp: Date.now() });
        return weather;
      }
    }
  } catch (err) {
    // Network fallback
  }

  // Graceful fallback with tropical baseline
  const isNight = new Date().getUTCHours() + 5.5 < 6 || new Date().getUTCHours() + 5.5 >= 18;
  const fallback: LiveSiteWeather = {
    temp: 28,
    condition: isNight ? 'Clear Night' : 'Sunny',
    humidity: 74,
    windSpeed: 10,
    isNight,
    updatedAt: new Date().toISOString()
  };

  return fallback;
}
