import { ObservationModel } from '../models/Observation.js';
import { SiteModel } from '../models/Site.js';
import { getOpenWeatherByCoords } from './weather.service.js';
import { getBestTimeCrowdSnapshot } from './besttime.service.js';
function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}
function estimateFromWeather(base, temp, humidity) {
    let score = base;
    if (temp !== undefined && temp > 30)
        score += 4;
    if (humidity !== undefined && humidity > 75)
        score += 3;
    return score;
}
export async function computeLiveDensity(site) {
    const latestObservation = await ObservationModel.findOne({ siteId: site._id })
        .sort({ sampledAt: -1 })
        .lean();
    const bestTime = await getBestTimeCrowdSnapshot(site);
    const weather = await getOpenWeatherByCoords(site.lat, site.lng);
    let crowdDensity = latestObservation?.density ?? site.currentDensity ?? 0;
    let source = 'system';
    if (bestTime.liveBusyness !== null) {
        crowdDensity = clamp(Math.round(bestTime.liveBusyness));
        source = 'besttime';
    }
    else if (bestTime.forecastDensity !== null) {
        const forecastAdjusted = estimateFromWeather(bestTime.forecastDensity, weather?.temp, weather?.humidity);
        crowdDensity = clamp(Math.round(forecastAdjusted));
        source = 'besttime';
    }
    else if (weather) {
        const weatherAdjusted = estimateFromWeather(crowdDensity, weather.temp, weather.humidity);
        crowdDensity = clamp(Math.round(weatherAdjusted));
        source = 'weather';
    }
    await ObservationModel.create({
        siteId: site._id,
        source,
        density: crowdDensity,
        sampledAt: new Date(),
        metadata: {
            bestTime,
            weather,
            previousObservationId: latestObservation?._id ?? null
        }
    });
    await SiteModel.updateOne({ _id: site._id }, {
        $set: {
            currentDensity: crowdDensity,
            currentDensityUpdatedAt: new Date()
        }
    });
    return {
        siteId: site._id,
        siteName: site.name,
        currentDensity: crowdDensity,
        source: bestTime.liveBusyness !== null ? 'besttime-live' : bestTime.forecastDensity !== null ? 'besttime-forecast' : weather ? 'weather' : 'system',
        weather,
        bestTime
    };
}
