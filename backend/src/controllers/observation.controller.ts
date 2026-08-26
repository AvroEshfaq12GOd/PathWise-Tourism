import { Request, Response } from 'express';
import { ObservationModel } from '../models/Observation.js';

export async function listObservations(req: Request, res: Response) {
  const query = req.query.siteId ? { siteId: req.query.siteId } : {};
  const observations = await ObservationModel.find(query).sort({ sampledAt: -1 }).limit(100).lean();
  res.json({ data: observations });
}

export async function createObservation(req: Request, res: Response) {
  const observation = await ObservationModel.create(req.body);
  res.status(201).json({ data: observation });
}
