import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IncentiveModel } from '../models/Incentive.js';
import { inMemoryStore, type InMemoryIncentive } from '../services/store.service.js';

export async function listIncentives(_req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const incentives = await IncentiveModel.find().sort({ createdAt: -1 }).lean();
      return res.json({ data: incentives });
    } catch {
      // Fallback
    }
  }
  return res.json({ data: inMemoryStore.incentives });
}

export async function createIncentive(req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const incentive = await IncentiveModel.create(req.body);
      return res.status(201).json({ data: incentive });
    } catch {
      // Fallback
    }
  }
  const newIncentive: InMemoryIncentive = {
    _id: '65f02a01100000000000' + (inMemoryStore.incentives.length + 1).toString().padStart(4, '0'),
    name: req.body.name || 'Reward Item',
    partner: req.body.partner || 'Local Partner',
    pointsCost: Number(req.body.pointsCost ?? 500),
    redemptions: Number(req.body.redemptions ?? 0),
    status: req.body.status || 'active',
    expiry: req.body.expiry || '2026-12-31',
    isHiddenGem: Boolean(req.body.isHiddenGem)
  };
  inMemoryStore.incentives.unshift(newIncentive);
  return res.status(201).json({ data: newIncentive });
}

export async function updateIncentive(req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const incentive = await IncentiveModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
      if (incentive) return res.json({ data: incentive });
    } catch {
      // Fallback
    }
  }
  const idx = inMemoryStore.incentives.findIndex((i) => i._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Incentive not found' });
  inMemoryStore.incentives[idx] = { ...inMemoryStore.incentives[idx], ...req.body };
  return res.json({ data: inMemoryStore.incentives[idx] });
}

