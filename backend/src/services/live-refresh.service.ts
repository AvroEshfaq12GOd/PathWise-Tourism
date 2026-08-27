import mongoose from 'mongoose';
import { SiteModel, type SiteDoc } from '../models/Site.js';
import { computeLiveDensity } from './crowd.service.js';
import { refreshSiteForecast } from './forecast.service.js';
import { inMemoryStore } from './store.service.js';

const DEFAULT_REFRESH_INTERVAL_MS = 10 * 60 * 1000;

let refreshTimer: ReturnType<typeof setInterval> | null = null;
let refreshInFlight = false;

async function refreshActiveSites() {
  if (refreshInFlight) return;
  refreshInFlight = true;

  try {
    if (mongoose.connection.readyState === 1) {
      const sites = await SiteModel.find({ isActive: true }).lean<SiteDoc[]>();

      const results = await Promise.allSettled(
        sites.map(async (site) => {
          await computeLiveDensity(site);
          await refreshSiteForecast(site._id.toString());
          return site._id.toString();
        })
      );

      const refreshed = results.filter((result) => result.status === 'fulfilled').length;
      const failed = results.length - refreshed;

      console.log(
        `[live-refresh] updated ${refreshed}/${results.length} active sites${failed ? ` (${failed} failed)` : ''}`
      );
    } else {
      for (const site of inMemoryStore.sites) {
        const drift = (Math.random() - 0.5) * 6;
        const newDensity = Math.max(10, Math.min(100, Math.round((site.currentDensity ?? 50) + drift)));
        site.currentDensity = newDensity;
        site.currentDensityUpdatedAt = new Date().toISOString();
      }
      console.log(`[live-refresh] refreshed ${inMemoryStore.sites.length} sites in-memory`);
    }
  } catch (error) {
    console.error('[live-refresh] failed to refresh live data', error);
  } finally {
    refreshInFlight = false;
  }
}

export async function primeLiveData() {
  await refreshActiveSites();
}

export function startLiveRefresh(intervalMs = DEFAULT_REFRESH_INTERVAL_MS) {
  if (refreshTimer) return () => stopLiveRefresh();

  refreshTimer = setInterval(() => {
    void refreshActiveSites();
  }, intervalMs);

  return () => stopLiveRefresh();
}

export function stopLiveRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

