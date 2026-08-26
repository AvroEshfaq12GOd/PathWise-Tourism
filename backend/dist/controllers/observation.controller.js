import { ObservationModel } from '../models/Observation.js';
export async function listObservations(req, res) {
    const query = req.query.siteId ? { siteId: req.query.siteId } : {};
    const observations = await ObservationModel.find(query).sort({ sampledAt: -1 }).limit(100).lean();
    res.json({ data: observations });
}
export async function createObservation(req, res) {
    const observation = await ObservationModel.create(req.body);
    res.status(201).json({ data: observation });
}
