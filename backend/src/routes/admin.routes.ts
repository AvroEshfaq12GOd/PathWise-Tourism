import { Router } from 'express';
import { listAdminLogs } from '../controllers/admin.controller.js';

export const adminRouter = Router();

adminRouter.get('/logs', listAdminLogs);
