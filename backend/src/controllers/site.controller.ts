import { Request, Response } from 'express';
import { SiteModel } from '../models/Site.js';
import { computeLiveDensity } from '../services/crowd.service.js';

export async function listSites(_req: Request, res: Response) {
  const sites = await SiteModel.find().lean();
  res.json({ data: sites });
}

export async function createSite(req: Request, res: Response) {
  const site = await SiteModel.create(req.body);
  res.status(201).json({ data: site });
}

export async function getSite(req: Request, res: Response) {
  const site = await SiteModel.findById(req.params.id).lean();
  if (!site) return res.status(404).json({ message: 'Site not found' });
  res.json({ data: site });
}

export async function updateSite(req: Request, res: Response) {
  const site = await SiteModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  if (!site) return res.status(404).json({ message: 'Site not found' });
  res.json({ data: site });
}

export async function refreshDensity(req: Request, res: Response) {
  const site = await SiteModel.findById(req.params.id);
  if (!site) return res.status(404).json({ message: 'Site not found' });
  const result = await computeLiveDensity(site);
  res.json({ data: result });
}
