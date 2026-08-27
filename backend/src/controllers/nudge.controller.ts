import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { NudgeModel } from '../models/Nudge.js';
import { inMemoryStore, type InMemoryNudge } from '../services/store.service.js';

export async function listNudges(req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const nudges = await NudgeModel.find(req.query.siteId ? { originalSiteId: req.query.siteId } : {}).sort({ createdAt: -1 }).lean();
      return res.json({ data: nudges });
    } catch {
      // Fallback
    }
  }
  const filtered = req.query.siteId
    ? inMemoryStore.nudges.filter((n) => n.originalSiteId === req.query.siteId)
    : inMemoryStore.nudges;
  return res.json({ data: filtered });
}

export async function createNudge(req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const nudge = await NudgeModel.create(req.body);
      return res.status(201).json({ data: nudge });
    } catch {
      // Fallback
    }
  }
  const newNudge: InMemoryNudge = {
    _id: '65f04a01100000000000' + (inMemoryStore.nudges.length + 1).toString().padStart(4, '0'),
    originalSiteId: req.body.originalSiteId || inMemoryStore.sites[0]?._id,
    altSiteId: req.body.altSiteId || inMemoryStore.sites[1]?._id,
    reason: req.body.reason || 'Peak crowd alternative suggestion',
    incentive: req.body.incentive || '+50 PathPoints',
    distanceKm: Number(req.body.distanceKm ?? 4.5),
    travelTimeMin: Number(req.body.travelTimeMin ?? 15),
    status: req.body.status || 'pending',
    createdAt: new Date().toISOString()
  };
  inMemoryStore.nudges.unshift(newNudge);
  return res.status(201).json({ data: newNudge });
}

export async function updateNudgeStatus(req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const nudge = await NudgeModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).lean();
      if (nudge) return res.json({ data: nudge });
    } catch {
      // Fallback
    }
  }
  const idx = inMemoryStore.nudges.findIndex((n) => n._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Nudge not found' });
  inMemoryStore.nudges[idx].status = req.body.status;
  return res.json({ data: inMemoryStore.nudges[idx] });
}

