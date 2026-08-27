export interface AdminBroadcastAlert {
  id: string;
  title: string;
  message: string;
  severity: 'emergency' | 'warning' | 'weather' | 'capacity_advisory' | 'info';
  targetSiteId: string; // 'all' or specific site id
  targetSiteName: string;
  author: string;
  timestamp: string;
  active: boolean;
  actionRequired?: string;
  redirectSiteName?: string;
}

const BROADCAST_STORAGE_KEY = 'pathwise_admin_broadcasts';

export const INITIAL_BROADCASTS: AdminBroadcastAlert[] = [
  {
    id: 'bc-sigiriya-01',
    title: 'Sigiriya Rock Fortress — Summit Staircase Staggering',
    message: 'High wind velocity and peak tourist ascent volume detected. Summit staircase entry is temporarily pulsed in 15-minute batches for visitor safety.',
    severity: 'capacity_advisory',
    targetSiteId: 'sigiriya',
    targetSiteName: 'Sigiriya Rock Fortress',
    author: 'Visitor Safety Field Operations',
    timestamp: 'Today, 10:15 AM SLST',
    active: true,
    actionRequired: 'Tourists advised to explore the Water Gardens and Frescoes Gallery first or divert to Pidurangala Rock (+200 PathPoints).',
    redirectSiteName: 'Pidurangala Rock'
  },
  {
    id: 'bc-yala-02',
    title: 'Yala National Park — Block 1 Safari Vehicle Limit',
    message: 'Carrying capacity limit reached at Palatupana Main Gate. Afternoon safari entries are redirected to Katagamuwa Gate and Lunugamvehera corridor.',
    severity: 'warning',
    targetSiteId: 'yala-safari',
    targetSiteName: 'Yala National Park Safari',
    author: 'Wildlife Sanctuary Command',
    timestamp: 'Today, 08:30 AM SLST',
    active: true,
    actionRequired: 'Safari operators must adhere to staggered radio dispatch slots.',
    redirectSiteName: 'Lunugamvehera National Park'
  }
];

export function getStoredBroadcasts(): AdminBroadcastAlert[] {
  try {
    const raw = localStorage.getItem(BROADCAST_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BROADCAST_STORAGE_KEY, JSON.stringify(INITIAL_BROADCASTS));
      return INITIAL_BROADCASTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BROADCASTS;
  }
}

export function saveBroadcastAlert(alert: Omit<AdminBroadcastAlert, 'id' | 'timestamp' | 'active'>): AdminBroadcastAlert {
  const all = getStoredBroadcasts();
  const newAlert: AdminBroadcastAlert = {
    ...alert,
    id: `bc-${Date.now()}`,
    timestamp: 'Just now (SLST)',
    active: true
  };
  const updated = [newAlert, ...all];
  localStorage.setItem(BROADCAST_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('pathwise_broadcast_update'));
  return newAlert;
}

export function toggleBroadcastActive(id: string): AdminBroadcastAlert[] {
  const all = getStoredBroadcasts();
  const updated = all.map((b) => (b.id === id ? { ...b, active: !b.active } : b));
  localStorage.setItem(BROADCAST_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('pathwise_broadcast_update'));
  return updated;
}

export function deleteBroadcastAlert(id: string): AdminBroadcastAlert[] {
  const all = getStoredBroadcasts();
  const updated = all.filter((b) => b.id !== id);
  localStorage.setItem(BROADCAST_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('pathwise_broadcast_update'));
  return updated;
}
