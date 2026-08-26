import { SiteModel } from '../models/Site.js';
import { computeLiveDensity } from './crowd.service.js';
import { refreshSiteForecast } from './forecast.service.js';
const DEFAULT_REFRESH_INTERVAL_MS = 10 * 60 * 1000;
let refreshTimer = null;
let refreshInFlight = false;
async function refreshActiveSites() {
    if (refreshInFlight)
        return;
    refreshInFlight = true;
    try {
        const sites = await SiteModel.find({ isActive: true }).lean();
        const results = await Promise.allSettled(sites.map(async (site) => {
            await computeLiveDensity(site);
            await refreshSiteForecast(site._id.toString());
            return site._id.toString();
        }));
        const refreshed = results.filter((result) => result.status === 'fulfilled').length;
        const failed = results.length - refreshed;
        console.log(`[live-refresh] updated ${refreshed}/${results.length} active sites${failed ? ` (${failed} failed)` : ''}`);
    }
    catch (error) {
        console.error('[live-refresh] failed to refresh live data', error);
    }
    finally {
        refreshInFlight = false;
    }
}
export async function primeLiveData() {
    await refreshActiveSites();
}
export function startLiveRefresh(intervalMs = DEFAULT_REFRESH_INTERVAL_MS) {
    if (refreshTimer)
        return () => stopLiveRefresh();
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
