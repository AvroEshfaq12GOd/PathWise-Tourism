import { NudgeModel } from '../models/Nudge.js';
export async function listNudges(req, res) {
    const nudges = await NudgeModel.find(req.query.siteId ? { originalSiteId: req.query.siteId } : {}).sort({ createdAt: -1 }).lean();
    res.json({ data: nudges });
}
export async function createNudge(req, res) {
    const nudge = await NudgeModel.create(req.body);
    res.status(201).json({ data: nudge });
}
export async function updateNudgeStatus(req, res) {
    const nudge = await NudgeModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).lean();
    if (!nudge)
        return res.status(404).json({ message: 'Nudge not found' });
    res.json({ data: nudge });
}
