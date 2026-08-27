import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ObservationModel } from '../models/Observation.js';
import { inMemoryStore, type InMemoryObservation } from '../services/store.service.js';

export async function listObservations(req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const query = req.query.siteId ? { siteId: req.query.siteId } : {};
      const observations = await ObservationModel.find(query).sort({ sampledAt: -1 }).limit(100).lean();
      return res.json({ data: observations });
    } catch {
      // Fallback
    }
  }
  const filtered = req.query.siteId
    ? inMemoryStore.observations.filter((o) => o.siteId === req.query.siteId)
    : inMemoryStore.observations;
  return res.json({ data: filtered });
}

export async function createObservation(req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const observation = await ObservationModel.create(req.body);
      return res.status(201).json({ data: observation });
    } catch {
      // Fallback
    }
  }
  const newObs: InMemoryObservation = {
    _id: `obs_${Date.now()}`,
    siteId: req.body.siteId || inMemoryStore.sites[0]?._id,
    source: req.body.source || 'manual',
    density: Number(req.body.density ?? 50),
    sampledAt: req.body.sampledAt || new Date().toISOString(),
    metadata: req.body.metadata || {}
  };
  inMemoryStore.observations.unshift(newObs);
  return res.status(201).json({ data: newObs });
}

