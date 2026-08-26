import { IncentiveModel } from '../models/Incentive.js';
export async function listIncentives(_req, res) {
    const incentives = await IncentiveModel.find().sort({ createdAt: -1 }).lean();
    res.json({ data: incentives });
}
export async function createIncentive(req, res) {
    const incentive = await IncentiveModel.create(req.body);
    res.status(201).json({ data: incentive });
}
export async function updateIncentive(req, res) {
    const incentive = await IncentiveModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!incentive)
        return res.status(404).json({ message: 'Incentive not found' });
    res.json({ data: incentive });
}
