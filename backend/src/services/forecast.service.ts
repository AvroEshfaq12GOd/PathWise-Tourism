import { ForecastModel } from '../models/Forecast.js';
import { ObservationModel } from '../models/Observation.js';
import { SiteModel, type SiteDoc } from '../models/Site.js';
import { getBestTimeForecast, resolveVenueProfile } from './besttime.service.js';

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function buildForecastPoints(base: number, trend: 'up' | 'down' | 'stable', horizonHours = 4) {
  const points = [] as Array<{ time: Date; density: number; lowerBound: number; upperBound: number }>;
  let last = base;

  for (let i = 1; i <= horizonHours; i += 1) {
    const drift = trend === 'up' ? 3.5 * i : trend === 'down' ? -3.5 * i : 0;
    const seasonal = Math.sin((new Date().getHours() + i - 8) * Math.PI / 12) * 4;
    const density = clamp(Math.round(last + drift + seasonal));
    points.push({
      time: new Date(Date.now() + i * 60 * 60 * 1000),
      density,
      lowerBound: clamp(density - 6),
      upperBound: clamp(density + 6)
    });
    last = density;
  }

  return points;
}

function buildForecastPointsFromSeries(series: number[], horizonHours = 4) {
  const points = [] as Array<{ time: Date; density: number; lowerBound: number; upperBound: number }>;
  const now = new Date();
  const startIndex = series.length >= 168 ? now.getDay() * 24 + now.getHours() : now.getHours();

  for (let i = 1; i <= horizonHours; i += 1) {
    const idx = series.length > 0 ? (startIndex + i) % series.length : 0;
    const density = clamp(Math.round(series[idx] ?? series[startIndex] ?? series[series.length - 1] ?? 0));
    points.push({
      time: new Date(Date.now() + i * 60 * 60 * 1000),
      density,
      lowerBound: clamp(density - 6),
      upperBound: clamp(density + 6)
    });
  }

  return points;
}

export async function generateSiteForecast(site: SiteDoc, horizonHours = 4) {
  const recentObservation = await ObservationModel.findOne({ siteId: site._id }).sort({ sampledAt: -1 }).lean();
  const profile = resolveVenueProfile(site);
  const bestTimeForecast = await getBestTimeForecast(profile);

  const base = recentObservation?.density ?? site.currentDensity ?? 0;
  const trend = base >= site.threshold ? 'up' : base <= site.threshold - 15 ? 'down' : 'stable';
  const points = bestTimeForecast?.footTrafficPercentage.length
    ? buildForecastPointsFromSeries(bestTimeForecast.footTrafficPercentage, horizonHours)
    : buildForecastPoints(base, trend, horizonHours);

  const forecast = await ForecastModel.create({
    siteId: site._id,
    generatedAt: new Date(),
    horizonHours,
    points,
    modelVersion: bestTimeForecast ? 'besttime-api-v1' : 'pathwise-mvp-v1',
    mae: null
  });

  return forecast;
}

export async function getLatestForecast(siteId: string) {
  return ForecastModel.findOne({ siteId }).sort({ generatedAt: -1 }).lean();
}

export async function refreshSiteForecast(siteId: string) {
  const site = await SiteModel.findById(siteId);
  if (!site) return null;
  return generateSiteForecast(site);
}
