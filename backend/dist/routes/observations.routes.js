import { Router } from 'express';
import { createObservation, listObservations } from '../controllers/observation.controller.js';
export const observationsRouter = Router();
observationsRouter.get('/', listObservations);
observationsRouter.post('/', createObservation);
