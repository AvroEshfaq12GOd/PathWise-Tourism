# PathWise Backend

## Setup

1. Create `backend/.env` from `backend/.env.example`.
2. Set your MongoDB URI and API keys.
3. Install dependencies inside `backend/`.
4. Start the server.

## Key endpoints

- `GET /health`
- `GET /api/sites`
- `POST /api/sites`
- `PATCH /api/sites/:id`
- `POST /api/sites/:id/refresh-density`
- `GET /api/observations`
- `POST /api/observations`
- `GET /api/forecasts/:siteId/latest`
- `POST /api/forecasts/:siteId/recompute`
- `GET /api/nudges`
- `POST /api/nudges`
- `GET /api/incentives`
- `GET /api/admin/logs`

## Notes

- OpenWeather is used for weather enrichment.
- BestTime is used for live busyness and venue forecast data.
- Crowd density is now sourced from BestTime first, with weather and site observations as fallback.
