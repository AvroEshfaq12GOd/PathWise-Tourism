import { Router } from 'express';
import { createIncentive, listIncentives, updateIncentive } from '../controllers/incentive.controller.js';
export const incentivesRouter = Router();
incentivesRouter.get('/', listIncentives);
incentivesRouter.post('/', createIncentive);
incentivesRouter.patch('/:id', updateIncentive);
