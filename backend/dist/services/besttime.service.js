import { env } from '../config/env.js';
function normalizeBaseUrl(baseUrl) {
    return baseUrl.replace(/\/$/, '');
}
function buildUrl(path, params) {
    const baseUrl = normalizeBaseUrl(env.bestTimeBaseUrl || 'https://besttime.app/api/v1');
    const url = new URL(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`);
    url.searchParams.set('api_key', env.bestTimeApiKey);
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '')
            continue;
        url.searchParams.set(key, String(value));
    }
    return url.toString();
}
async function fetchJson(url, timeoutMs = 8000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, {
            signal: controller.signal,
            headers: {
                Accept: 'application/json'
            }
        });
        if (!res.ok)
            return null;
        return (await res.json());
    }
    catch {
        return null;
    }
    finally {
        clearTimeout(timeout);
    }
}
function toNumber(value) {
    if (typeof value === 'number' && Number.isFinite(value))
        return value;
    if (typeof value === 'string' && value.trim()) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}
function resolveVenueAddress(site) {
    return (site.bestTimeVenueAddress?.trim() ||
        [site.name, site.region, 'Sri Lanka'].filter(Boolean).join(', '));
}
export function resolveVenueProfile(site) {
    return {
        venueName: site.bestTimeVenueName?.trim() || site.name,
        venueAddress: resolveVenueAddress(site)
    };
}
function getForecastIndex(forecastLength, now = new Date()) {
    if (forecastLength <= 0)
        return 0;
    const hour = now.getHours();
    const day = now.getDay();
    if (forecastLength >= 168)
        return Math.min(forecastLength - 1, day * 24 + hour);
    if (forecastLength >= 24)
        return Math.min(forecastLength - 1, hour);
    return forecastLength - 1;
}
export async function getBestTimeForecast(profile) {
    if (!env.bestTimeApiKey)
        return null;
    const url = buildUrl('/forecasts', {
        venue_name: profile.venueName,
        venue_address: profile.venueAddress
    });
    const data = await fetchJson(url);
    const footTrafficPercentage = Array.isArray(data?.foot_traffic_percentage)
        ? data?.foot_traffic_percentage.map((value) => toNumber(value) ?? 0)
        : [];
    const currentIndex = getForecastIndex(footTrafficPercentage.length);
    return {
        venueName: data?.venue_info?.venue_name || profile.venueName,
        venueAddress: data?.venue_info?.venue_address || profile.venueAddress,
        footTrafficPercentage,
        currentForecast: footTrafficPercentage[currentIndex] ?? null,
        dayInfo: data?.day_info
            ? {
                dayText: data.day_info.day_text,
                dayMean: data.day_info.day_mean,
                dayMax: data.day_info.day_max
            }
            : null,
        busyHours: Array.isArray(data?.busy_hours)
            ? data.busy_hours.map((value) => toNumber(value) ?? 0)
            : [],
        quietHours: Array.isArray(data?.quiet_hours)
            ? data.quiet_hours.map((value) => toNumber(value) ?? 0)
            : [],
        raw: data
    };
}
export async function getBestTimeLiveBusyness(profile) {
    if (!env.bestTimeApiKey)
        return null;
    const url = buildUrl('/live', {
        venue_name: profile.venueName,
        venue_address: profile.venueAddress
    });
    const data = await fetchJson(url);
    if (!data)
        return null;
    const liveBusyness = toNumber(data.live_busyness) ??
        toNumber(data.live_foot_traffic) ??
        toNumber(data.busyness) ??
        toNumber(data.busy_now) ??
        toNumber(data.current_busyness) ??
        toNumber(data.current_live_busyness) ??
        null;
    return {
        venueName: profile.venueName,
        venueAddress: profile.venueAddress,
        liveBusyness,
        raw: data
    };
}
export async function getBestTimeCrowdSnapshot(site) {
    const profile = resolveVenueProfile(site);
    const [live, forecast] = await Promise.all([
        getBestTimeLiveBusyness(profile),
        getBestTimeForecast(profile)
    ]);
    return {
        profile,
        liveBusyness: live?.liveBusyness ?? null,
        forecastDensity: forecast?.currentForecast ?? null,
        live,
        forecast
    };
}
