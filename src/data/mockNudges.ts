export interface Nudge {
  id: string;
  originalSiteId: string;
  altSiteId: string;
  reason: string;
  incentive: string;
  distanceKm: number;
  travelTimeMin: number;
}

export const mockNudges: Nudge[] = [
{
  id: 'n1',
  originalSiteId: 's1', // Temple of the Tooth (Crowded)
  altSiteId: 's2', // Botanical Gardens (Less crowded)
  reason: 'Temple of the Tooth is predicted to hit 95% capacity at 14:00.',
  incentive: '+75 PathPoints',
  distanceKm: 5.2,
  travelTimeMin: 15
},
{
  id: 'n2',
  originalSiteId: 's3', // Sigiriya
  altSiteId: 's4', // Galle Fort (just as an example alternative)
  reason:
  'Sigiriya is currently experiencing heavy congestion on the main stairway.',
  incentive: '10% off Café Partner',
  distanceKm: 12.5,
  travelTimeMin: 25
}];