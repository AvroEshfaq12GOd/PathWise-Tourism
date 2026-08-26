import { getLatestForecast, refreshSiteForecast } from '../services/forecast.service.js';
export async function latestForecast(req, res) {
    const forecast = await getLatestForecast(req.params.siteId);
    if (!forecast)
        return res.status(404).json({ message: 'Forecast not found' });
    res.json({ data: forecast });
}
export async function recomputeForecast(req, res) {
    const forecast = await refreshSiteForecast(req.params.siteId);
    if (!forecast)
        return res.status(404).json({ message: 'Site not found' });
    res.json({ data: forecast });
}
