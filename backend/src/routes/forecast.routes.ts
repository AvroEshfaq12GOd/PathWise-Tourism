import { Router } from 'express';
import { latestForecast, recomputeForecast } from '../controllers/forecast.controller.js';

export const forecastRouter = Router();

forecastRouter.get('/:siteId/latest', latestForecast);
forecastRouter.post('/:siteId/recompute', recomputeForecast);
