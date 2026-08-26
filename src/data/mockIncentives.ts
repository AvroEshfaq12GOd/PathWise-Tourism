export interface Incentive {
  id: string;
  name: string;
  partner: string;
  pointsCost: number;
  redemptions: number;
  status: 'active' | 'paused';
  expiry: string;
  isHiddenGem?: boolean;
}

export const mockIncentives: Incentive[] = [
{
  id: 'i1',
  name: 'Free Iced Coffee',
  partner: 'Barista Kandy',
  pointsCost: 500,
  redemptions: 1240,
  status: 'active',
  expiry: '2026-12-31'
},
{
  id: 'i2',
  name: 'Museum Pass',
  partner: 'National Museum',
  pointsCost: 1200,
  redemptions: 850,
  status: 'active',
  expiry: '2026-12-31'
},
{
  id: 'i3',
  name: '10% Off Dinner',
  partner: 'Galle Fort Hotel',
  pointsCost: 300,
  redemptions: 432,
  status: 'paused',
  expiry: '2026-06-30'
},
{
  id: 'i4',
  name: 'Free Audio Guide',
  partner: 'Sigiriya Trust',
  pointsCost: 150,
  redemptions: 2100,
  status: 'active',
  expiry: '2026-12-31'
},
{
  id: 'i5',
  name: 'Botanical Gardens Entry',
  partner: 'Peradeniya Gardens',
  pointsCost: 800,
  redemptions: 65,
  status: 'active',
  expiry: '2026-12-31',
  isHiddenGem: true
},
{
  id: 'i6',
  name: 'Tuk-Tuk Credit',
  partner: 'PickMe',
  pointsCost: 400,
  redemptions: 3400,
  status: 'active',
  expiry: '2026-12-31'
}];