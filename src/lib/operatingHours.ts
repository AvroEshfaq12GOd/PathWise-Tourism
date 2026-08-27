/**
 * Sri Lanka Tourism Operational Hours, Day-Night Diurnal Curve & Real-Time Sync Engine
 */

export interface SiteOperatingProfile {
  opensAt: number; // Decimal hour, e.g., 6.5 = 06:30
  closesAt: number; // Decimal hour, e.g., 17.5 = 17:30
  is24Hours?: boolean;
  isNightPeak?: boolean; // e.g. Sri Pada night climb, Galle Face night market
  hoursLabel: string;
  categoryType: 'museum' | 'wildlife' | 'temple' | 'nature' | 'beach' | 'highland' | 'heritage';
}

/**
 * Real-world operational hours for all major Sri Lankan destinations
 */
export const SITE_OPERATING_PROFILES: Record<string, SiteOperatingProfile> = {
  // Museums (09:00 - 17:00)
  'colombo national museum': {
    opensAt: 9.0,
    closesAt: 17.0,
    hoursLabel: '09:00 AM – 05:00 PM',
    categoryType: 'museum'
  },
  'national museum': {
    opensAt: 9.0,
    closesAt: 17.0,
    hoursLabel: '09:00 AM – 05:00 PM',
    categoryType: 'museum'
  },

  // Botanical Gardens
  'royal botanical gardens': {
    opensAt: 7.5,
    closesAt: 18.0,
    hoursLabel: '07:30 AM – 06:00 PM',
    categoryType: 'nature'
  },
  'botanical': {
    opensAt: 7.5,
    closesAt: 18.0,
    hoursLabel: '07:30 AM – 06:00 PM',
    categoryType: 'nature'
  },

  // Heritage & Fortresses
  'sigiriya': {
    opensAt: 6.5,
    closesAt: 17.5,
    hoursLabel: '06:30 AM – 05:30 PM',
    categoryType: 'heritage'
  },
  'pidurangala': {
    opensAt: 5.0,
    closesAt: 19.0,
    hoursLabel: '05:00 AM – 07:00 PM (Sunrise/Sunset)',
    categoryType: 'highland'
  },
  'galle fort': {
    opensAt: 0.0,
    closesAt: 24.0,
    is24Hours: true,
    hoursLabel: 'Open 24 Hours (Ramparts)',
    categoryType: 'heritage'
  },
  'polonnaruwa': {
    opensAt: 7.0,
    closesAt: 17.5,
    hoursLabel: '07:00 AM – 05:30 PM',
    categoryType: 'heritage'
  },
  'anuradhapura': {
    opensAt: 6.0,
    closesAt: 20.0,
    hoursLabel: '06:00 AM – 08:00 PM',
    categoryType: 'temple'
  },
  'dambulla': {
    opensAt: 7.0,
    closesAt: 19.0,
    hoursLabel: '07:00 AM – 07:00 PM',
    categoryType: 'temple'
  },
  'tooth relic': {
    opensAt: 5.5,
    closesAt: 20.5,
    hoursLabel: '05:30 AM – 08:30 PM (Pooja Timings)',
    categoryType: 'temple'
  },
  'gangaramaya': {
    opensAt: 6.0,
    closesAt: 20.0,
    hoursLabel: '06:00 AM – 08:00 PM',
    categoryType: 'temple'
  },
  'kataragama': {
    opensAt: 4.5,
    closesAt: 22.0,
    hoursLabel: '04:30 AM – 10:00 PM (Pooja Services)',
    categoryType: 'temple'
  },
  'koneswaram': {
    opensAt: 6.0,
    closesAt: 19.0,
    hoursLabel: '06:00 AM – 07:00 PM',
    categoryType: 'temple'
  },
  'mihintale': {
    opensAt: 6.0,
    closesAt: 19.5,
    hoursLabel: '06:00 AM – 07:30 PM',
    categoryType: 'temple'
  },
  'nagadeepa': {
    opensAt: 6.0,
    closesAt: 18.0,
    hoursLabel: '06:00 AM – 06:00 PM (Ferry Dependent)',
    categoryType: 'temple'
  },

  // National Wildlife Parks (Strict DWC Safari gate hours)
  'yala': {
    opensAt: 6.0,
    closesAt: 18.0,
    hoursLabel: '06:00 AM – 06:00 PM (Safari Gates)',
    categoryType: 'wildlife'
  },
  'udawalawe': {
    opensAt: 6.0,
    closesAt: 18.0,
    hoursLabel: '06:00 AM – 06:00 PM (Jeep Tours)',
    categoryType: 'wildlife'
  },
  'wilpattu': {
    opensAt: 6.0,
    closesAt: 18.0,
    hoursLabel: '06:00 AM – 06:00 PM',
    categoryType: 'wildlife'
  },
  'minneriya': {
    opensAt: 6.0,
    closesAt: 18.5,
    hoursLabel: '06:00 AM – 06:30 PM (Elephant Gathering)',
    categoryType: 'wildlife'
  },
  'kaudulla': {
    opensAt: 6.0,
    closesAt: 18.0,
    hoursLabel: '06:00 AM – 06:00 PM',
    categoryType: 'wildlife'
  },
  'sinharaja': {
    opensAt: 6.5,
    closesAt: 17.5,
    hoursLabel: '06:30 AM – 05:30 PM (Trek Guides)',
    categoryType: 'nature'
  },
  'horton plains': {
    opensAt: 6.0,
    closesAt: 16.0,
    hoursLabel: '06:00 AM – 04:00 PM (Last Entry 2PM)',
    categoryType: 'nature'
  },

  // Highlands, Bridges & Mountains
  'nine arches': {
    opensAt: 0.0,
    closesAt: 24.0,
    is24Hours: true,
    hoursLabel: 'Open 24 Hours (Best 6AM–6PM)',
    categoryType: 'highland'
  },
  'little adam': {
    opensAt: 0.0,
    closesAt: 24.0,
    is24Hours: true,
    hoursLabel: 'Open 24 Hours (Sunrise/Sunset)',
    categoryType: 'highland'
  },
  'sri pada': {
    opensAt: 0.0,
    closesAt: 24.0,
    is24Hours: true,
    isNightPeak: true,
    hoursLabel: 'Open 24 Hours (Night Ascent Active)',
    categoryType: 'highland'
  },
  'knuckles': {
    opensAt: 6.0,
    closesAt: 17.0,
    hoursLabel: '06:00 AM – 05:00 PM (Permit Trekking)',
    categoryType: 'nature'
  },
  'gregory lake': {
    opensAt: 6.0,
    closesAt: 20.0,
    hoursLabel: '06:00 AM – 08:00 PM (Boat Park)',
    categoryType: 'highland'
  },
  'ramboda': {
    opensAt: 7.0,
    closesAt: 18.0,
    hoursLabel: '07:00 AM – 06:00 PM',
    categoryType: 'nature'
  },

  // Beaches & Coastal Areas (24 Hours Open)
  'mirissa': {
    opensAt: 0.0,
    closesAt: 24.0,
    is24Hours: true,
    hoursLabel: 'Open 24 Hours (Beach & Sunset)',
    categoryType: 'beach'
  },
  'arugam bay': {
    opensAt: 0.0,
    closesAt: 24.0,
    is24Hours: true,
    hoursLabel: 'Open 24 Hours (Surf Point)',
    categoryType: 'beach'
  },
  'bentota': {
    opensAt: 0.0,
    closesAt: 24.0,
    is24Hours: true,
    hoursLabel: 'Open 24 Hours (Water Sports 8AM–6PM)',
    categoryType: 'beach'
  },
  'hikkaduwa': {
    opensAt: 0.0,
    closesAt: 24.0,
    is24Hours: true,
    hoursLabel: 'Open 24 Hours (Reef Diving 8AM–5PM)',
    categoryType: 'beach'
  },
  'pasikudah': {
    opensAt: 0.0,
    closesAt: 24.0,
    is24Hours: true,
    hoursLabel: 'Open 24 Hours (Calm Coral Bay)',
    categoryType: 'beach'
  },
  'pigeon island': {
    opensAt: 8.0,
    closesAt: 17.0,
    hoursLabel: '08:00 AM – 05:00 PM (Boat Access)',
    categoryType: 'beach'
  },
  'jaffna': {
    opensAt: 8.0,
    closesAt: 18.5,
    hoursLabel: '08:00 AM – 06:30 PM',
    categoryType: 'heritage'
  },
  'delft island': {
    opensAt: 7.5,
    closesAt: 16.5,
    hoursLabel: '07:30 AM – 04:30 PM (Ferry Regulated)',
    categoryType: 'heritage'
  }
};

/**
 * Lookup operational profile by site name or category
 */
export function getSiteOperatingProfile(name: string, category?: string): SiteOperatingProfile {
  const clean = (name || '').toLowerCase();
  for (const [key, profile] of Object.entries(SITE_OPERATING_PROFILES)) {
    if (clean.includes(key)) {
      return profile;
    }
  }

  // Default fallback profiles by category
  const cat = (category || '').toLowerCase();
  if (cat.includes('museum')) {
    return { opensAt: 9.0, closesAt: 17.0, hoursLabel: '09:00 AM – 05:00 PM', categoryType: 'museum' };
  }
  if (cat.includes('wildlife') || cat.includes('safari') || cat.includes('national park')) {
    return { opensAt: 6.0, closesAt: 18.0, hoursLabel: '06:00 AM – 06:00 PM', categoryType: 'wildlife' };
  }
  if (cat.includes('temple') || cat.includes('sacred') || cat.includes('pilgrim')) {
    return { opensAt: 5.5, closesAt: 20.5, hoursLabel: '05:30 AM – 08:30 PM', categoryType: 'temple' };
  }
  if (cat.includes('beach') || cat.includes('coastal')) {
    return { opensAt: 0.0, closesAt: 24.0, is24Hours: true, hoursLabel: 'Open 24 Hours', categoryType: 'beach' };
  }

  // Default daylight heritage / nature hours
  return { opensAt: 7.0, closesAt: 18.0, hoursLabel: '07:00 AM – 06:00 PM', categoryType: 'nature' };
}

/**
 * Calculates current Sri Lankan Standard Time (UTC+5:30) as fractional hour (e.g. 21.25 = 21:15)
 */
export function getCurrentSriLankaDecimalHour(): {
  decimalHour: number;
  hour: number;
  minute: number;
  isNight: boolean;
  timeString: string;
} {
  const now = new Date();
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });
  const parts = timeFormatter.formatToParts(now);
  const hourPart = parts.find(p => p.type === 'hour')?.value || '12';
  const minutePart = parts.find(p => p.type === 'minute')?.value || '0';

  const hour = parseInt(hourPart, 10);
  const minute = parseInt(minutePart, 10);
  const decimalHour = hour + minute / 60;
  const isNight = hour < 6 || hour >= 18;

  // Format 12-hour AM/PM string
  const hour12 = hour % 12 || 12;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const timeString = `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;

  return { decimalHour, hour, minute, isNight, timeString };
}

export interface SiteDayNightStatus {
  isOpen: boolean;
  statusLabel: string;
  statusBadge: 'open' | 'closed' | 'closing-soon' | 'night-active';
  operatingHours: string;
  effectiveDensity: number; // Synchronized density (0% when closed, diurnal when open)
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Closed';
  isHolidaySurge: boolean;
}

/**
 * Computes realistic, day-night synchronized status and crowd density
 * for any Sri Lankan tourist site at the current Sri Lankan moment.
 */
export function computeSiteDayNightStatus(
  siteName: string,
  category: string,
  basePeakDensity: number,
  isHoliday: boolean = true
): SiteDayNightStatus {
  const profile = getSiteOperatingProfile(siteName, category);
  const { decimalHour, hour } = getCurrentSriLankaDecimalHour();

  // Determine if open right now
  let isOpen = false;
  if (profile.is24Hours) {
    isOpen = true;
  } else if (decimalHour >= profile.opensAt && decimalHour < profile.closesAt) {
    isOpen = true;
  }

  // If closed:
  if (!isOpen) {
    const opensTomorrowAt = formatDecimalHour(profile.opensAt);
    return {
      isOpen: false,
      statusLabel: `Closed • Opens tomorrow at ${opensTomorrowAt}`,
      statusBadge: 'closed',
      operatingHours: profile.hoursLabel,
      effectiveDensity: 0,
      crowdLevel: 'Closed',
      isHolidaySurge: false
    };
  }

  // If closing within 45 minutes:
  const timeUntilClose = profile.closesAt - decimalHour;
  const isClosingSoon = !profile.is24Hours && timeUntilClose > 0 && timeUntilClose <= 0.75;

  // Calculate diurnal bell-curve crowd density based on current SL hour
  let diurnalFactor = 0.5;

  if (profile.isNightPeak) {
    // Night pilgrimage / night activity (peaks 01:00 - 05:30 AM for sunrise or 19:00 - 22:00)
    if (hour >= 20 || hour <= 6) {
      diurnalFactor = 0.85 + Math.sin((hour + 2) * 0.5) * 0.15;
    } else {
      diurnalFactor = 0.3;
    }
  } else if (profile.is24Hours) {
    // Beaches / promenades (peaks 16:00 - 19:30 sunset)
    if (hour >= 15 && hour <= 19) {
      diurnalFactor = 0.9;
    } else if (hour >= 9 && hour < 15) {
      diurnalFactor = 0.6;
    } else if (hour >= 20 && hour <= 23) {
      diurnalFactor = 0.45;
    } else {
      diurnalFactor = 0.15;
    }
  } else {
    // Standard daylight attractions
    const openDuration = profile.closesAt - profile.opensAt;
    const progress = (decimalHour - profile.opensAt) / openDuration; // 0 to 1
    // Parabolic bell curve peak around mid-day (progress = 0.5)
    diurnalFactor = Math.max(0.2, Math.sin(progress * Math.PI));
  }

  // Surge multipliers for Poya/Festivals and peak base
  let holidayMultiplier = isHoliday ? 1.2 : 1.0;
  if (profile.categoryType === 'temple' && isHoliday) {
    holidayMultiplier = 1.35; // Temples surge on Poya days
  }

  let calculatedDensity = Math.round(basePeakDensity * diurnalFactor * holidayMultiplier);
  calculatedDensity = Math.max(10, Math.min(98, calculatedDensity));

  let crowdLevel: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Moderate';
  if (calculatedDensity >= 85) crowdLevel = 'Critical';
  else if (calculatedDensity >= 65) crowdLevel = 'High';
  else if (calculatedDensity >= 35) crowdLevel = 'Moderate';
  else crowdLevel = 'Low';

  const closesAtFormatted = formatDecimalHour(profile.closesAt);
  const statusLabel = isClosingSoon
    ? `Closing Soon • Closes at ${closesAtFormatted}`
    : profile.is24Hours
    ? `Open 24 Hours`
    : `Open Now • Closes at ${closesAtFormatted}`;

  return {
    isOpen: true,
    statusLabel,
    statusBadge: isClosingSoon ? 'closing-soon' : profile.isNightPeak ? 'night-active' : 'open',
    operatingHours: profile.hoursLabel,
    effectiveDensity: calculatedDensity,
    crowdLevel,
    isHolidaySurge: isHoliday && (profile.categoryType === 'temple' || profile.categoryType === 'heritage')
  };
}

function formatDecimalHour(dh: number): string {
  const h = Math.floor(dh);
  const m = Math.round((dh - h) * 60);
  const hour12 = h % 12 || 12;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Generates an accurate 24-hour Diurnal TimeSeries forecast that accounts for
 * operating hours (0% during off-hours) and diurnal peaks during opening hours.
 */
export function generateDayNightLSTMData(
  siteName: string,
  category: string,
  basePeakDensity: number,
  trend: 'up' | 'down' | 'stable' = 'stable',
  isHoliday: boolean = true
) {
  const profile = getSiteOperatingProfile(siteName, category);
  const { hour: currentSLHour } = getCurrentSriLankaDecimalHour();
  const data = [];

  // Generate 12 past hours + current hour + 6 forecast hours
  for (let offset = -12; offset <= 6; offset++) {
    const targetHour = (currentSLHour + offset + 24) % 24;
    const isForecast = offset > 0;
    const hourLabel = `${targetHour.toString().padStart(2, '0')}:00`;

    // Check if site is open at target hour
    let isOpenAtHour = false;
    if (profile.is24Hours) {
      isOpenAtHour = true;
    } else if (targetHour >= Math.floor(profile.opensAt) && targetHour < Math.ceil(profile.closesAt)) {
      isOpenAtHour = true;
    }

    if (!isOpenAtHour) {
      // Off hours / Night closure
      data.push({
        time: hourLabel,
        density: 0,
        isForecast,
        lowerBound: 0,
        upperBound: 0,
        isClosedHour: true
      });
    } else {
      // Open hour curve calculation
      let factor = 0.5;
      if (profile.isNightPeak) {
        factor = (targetHour >= 20 || targetHour <= 5) ? 0.9 : 0.25;
      } else if (profile.is24Hours) {
        factor = (targetHour >= 16 && targetHour <= 19) ? 0.9 : (targetHour >= 9 && targetHour <= 15) ? 0.6 : 0.3;
      } else {
        const span = profile.closesAt - profile.opensAt;
        const progress = Math.max(0, Math.min(1, (targetHour - profile.opensAt) / span));
        factor = Math.max(0.15, Math.sin(progress * Math.PI));
      }

      let val = Math.round(basePeakDensity * factor * (isHoliday ? 1.15 : 1.0));
      if (trend === 'up' && isForecast) val = Math.min(98, val + offset * 3);
      if (trend === 'down' && isForecast) val = Math.max(10, val - offset * 3);
      val = Math.max(5, Math.min(98, val));

      data.push({
        time: hourLabel,
        density: val,
        isForecast,
        lowerBound: Math.max(0, val - 6),
        upperBound: Math.min(100, val + 6),
        isClosedHour: false
      });
    }
  }

  return data;
}
