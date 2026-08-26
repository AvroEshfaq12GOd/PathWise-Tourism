import { Router } from 'express';
import { createNudge, listNudges, updateNudgeStatus } from '../controllers/nudge.controller.js';
export const nudgesRouter = Router();
nudgesRouter.get('/', listNudges);
nudgesRouter.post('/', createNudge);
nudgesRouter.patch('/:id', updateNudgeStatus);
