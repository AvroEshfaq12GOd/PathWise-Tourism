import { Router } from 'express';
import { createSite, getSite, listSites, refreshDensity, updateSite } from '../controllers/site.controller.js';

export const sitesRouter = Router();

sitesRouter.get('/', listSites);
sitesRouter.post('/', createSite);
sitesRouter.get('/:id', getSite);
sitesRouter.patch('/:id', updateSite);
sitesRouter.post('/:id/refresh-density', refreshDensity);
