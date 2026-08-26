import { Router } from 'express';
import { sitesRouter } from './sites.routes.js';
import { observationsRouter } from './observations.routes.js';
import { forecastRouter } from './forecast.routes.js';
import { nudgesRouter } from './nudges.routes.js';
import { incentivesRouter } from './incentives.routes.js';
import { adminRouter } from './admin.routes.js';

export const apiRouter = Router();

apiRouter.use('/sites', sitesRouter);
apiRouter.use('/observations', observationsRouter);
apiRouter.use('/forecasts', forecastRouter);
apiRouter.use('/nudges', nudgesRouter);
apiRouter.use('/incentives', incentivesRouter);
apiRouter.use('/admin', adminRouter);
