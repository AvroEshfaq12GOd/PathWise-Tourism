import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { SiteModel } from '../models/Site.js';
import { computeLiveDensity } from '../services/crowd.service.js';
import { inMemoryStore, type InMemorySite } from '../services/store.service.js';

export async function listSites(_req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const sites = await SiteModel.find().lean();
      return res.json({ data: sites });
    } catch {
      // Fallback
    }
  }
  return res.json({ data: inMemoryStore.sites });
}

export async function createSite(req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const site = await SiteModel.create(req.body);
      return res.status(201).json({ data: site });
    } catch {
      // Fallback
    }
  }
  const newSite: InMemorySite = {
    _id: '65f01a01100000000000' + (inMemoryStore.sites.length + 1).toString().padStart(4, '0'),
    name: req.body.name || 'Untitled Site',
    bestTimeVenueName: req.body.bestTimeVenueName || '',
    bestTimeVenueAddress: req.body.bestTimeVenueAddress || '',
    category: req.body.category || 'Cultural',
    region: req.body.region || 'Central',
    lat: Number(req.body.lat ?? 7.29),
    lng: Number(req.body.lng ?? 80.64),
    maxCapacity: Number(req.body.maxCapacity ?? 5000),
    threshold: Number(req.body.threshold ?? 85),
    criticalThreshold: Number(req.body.criticalThreshold ?? 95),
    isActive: req.body.isActive !== false,
    imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1588096344356-896898822184?auto=format&fit=crop&q=80&w=800',
    features: Array.isArray(req.body.features) ? req.body.features : ['Historical', 'Live data'],
    currentDensity: Number(req.body.currentDensity ?? 50),
    currentDensityUpdatedAt: new Date().toISOString()
  };
  inMemoryStore.sites.push(newSite);
  return res.status(201).json({ data: newSite });
}

export async function getSite(req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const site = await SiteModel.findById(req.params.id).lean();
      if (site) return res.json({ data: site });
    } catch {
      // Fallback
    }
  }
  const site = inMemoryStore.sites.find((s) => s._id === req.params.id);
  if (!site) return res.status(404).json({ message: 'Site not found' });
  return res.json({ data: site });
}

export async function updateSite(req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const site = await SiteModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
      if (site) return res.json({ data: site });
    } catch {
      // Fallback
    }
  }
  const idx = inMemoryStore.sites.findIndex((s) => s._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Site not found' });
  inMemoryStore.sites[idx] = { ...inMemoryStore.sites[idx], ...req.body };
  return res.json({ data: inMemoryStore.sites[idx] });
}

export async function refreshDensity(req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const site = await SiteModel.findById(req.params.id);
      if (site) {
        const result = await computeLiveDensity(site);
        return res.json({ data: result });
      }
    } catch {
      // Fallback
    }
  }
  const site = inMemoryStore.sites.find((s) => s._id === req.params.id);
  if (!site) return res.status(404).json({ message: 'Site not found' });
  const drift = (Math.random() - 0.5) * 8;
  const newDensity = Math.max(10, Math.min(100, Math.round((site.currentDensity ?? 50) + drift)));
  site.currentDensity = newDensity;
  site.currentDensityUpdatedAt = new Date().toISOString();

  inMemoryStore.observations.unshift({
    _id: `obs_${Date.now()}`,
    siteId: site._id,
    source: 'live-refresh',
    density: newDensity,
    sampledAt: new Date().toISOString(),
    metadata: { weather: { temp: 28, condition: 'Sunny' } }
  });

  return res.json({
    data: {
      siteId: site._id,
      siteName: site.name,
      currentDensity: newDensity,
      source: 'live-simulation',
      weather: { temp: 28, condition: 'Sunny' }
    }
  });
}

