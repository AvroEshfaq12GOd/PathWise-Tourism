import mongoose from 'mongoose';
import { SiteModel, type SiteDoc } from '../models/Site.js';
import { computeLiveDensity } from './crowd.service.js';
import { refreshSiteForecast } from './forecast.service.js';
import { inMemoryStore, initialSites } from './store.service.js';

const DEFAULT_REFRESH_INTERVAL_MS = 10 * 60 * 1000;

let refreshTimer: ReturnType<typeof setInterval> | null = null;
let refreshInFlight = false;

async function syncMongoSitesIfEmpty() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const count = await SiteModel.countDocuments();
    if (count < initialSites.length) {
      console.log(`[PathWise] Syncing ${initialSites.length} official SLTDA sites to MongoDB (found ${count})...`);
      for (const site of initialSites) {
        await SiteModel.findByIdAndUpdate(
          site._id,
          {
            $set: {
              name: site.name,
              bestTimeVenueName: site.bestTimeVenueName,
              bestTimeVenueAddress: site.bestTimeVenueAddress,
              category: site.category,
              sltdaCategory: site.sltdaCategory,
              region: site.region,
              lat: site.lat,
              lng: site.lng,
              maxCapacity: site.maxCapacity,
              threshold: site.threshold,
              criticalThreshold: site.criticalThreshold,
              isActive: site.isActive,
              imageUrl: site.imageUrl,
              features: site.features,
              currentDensity: site.currentDensity,
              currentDensityUpdatedAt: new Date(site.currentDensityUpdatedAt || Date.now()),
              sltdaCertified: site.sltdaCertified ?? true,
              unescoHeritage: site.unescoHeritage ?? false,
              description: site.description ?? ''
            }
          },
          { upsert: true, new: true }
        );
      }
      console.log(`[PathWise] Successfully synced all ${initialSites.length} SLTDA sites to MongoDB.`);
    }
  } catch (err) {
    console.warn('[PathWise] Failed to sync sites to MongoDB:', err);
  }
}

async function refreshActiveSites() {
  if (refreshInFlight) return;
  refreshInFlight = true;

  try {
    if (mongoose.connection.readyState === 1) {
      await syncMongoSitesIfEmpty();
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
  await syncMongoSitesIfEmpty();
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

