export interface SriLankaHoliday {
  name: string;
  type: 'Poya' | 'Public' | 'Festival' | 'Bank';
  date: string; // YYYY-MM-DD
  endDate?: string; // Optional end date for multi-day festivals (YYYY-MM-DD)
  month: string;
  day: number;
  description: string;
  affectedSites?: string[]; // Specific site IDs if localized festival
}

/**
 * Official Sri Lankan Poya Days, National Holidays & Key Festivals (2025/2026/2027 Calendar)
 */
export const SRI_LANKA_HOLIDAYS_AND_FESTIVALS: SriLankaHoliday[] = [
  {
    name: 'Duruthu Full Moon Poya Day',
    type: 'Poya',
    date: '2026-01-13',
    month: 'Jan',
    day: 13,
    description: 'First visit of Gautama Buddha to Sri Lanka (Mahiyangana Sacred Stupa).'
  },
  {
    name: 'Tamil Thai Pongal Day',
    type: 'Festival',
    date: '2026-01-15',
    month: 'Jan',
    day: 15,
    description: 'Harvest thanksgiving festival dedicated to Surya the Sun God.'
  },
  {
    name: 'National Independence Day',
    type: 'Public',
    date: '2026-02-04',
    month: 'Feb',
    day: 4,
    description: 'Sri Lanka 78th Independence Day national celebrations & parade in Colombo.'
  },
  {
    name: 'Navam Full Moon Poya Day',
    type: 'Poya',
    date: '2026-02-12',
    month: 'Feb',
    day: 12,
    description: 'Gangaramaya Navam Perahera procession in Colombo with majestic elephants.'
  },
  {
    name: 'Maha Shivaratri Day',
    type: 'Festival',
    date: '2026-02-16',
    month: 'Feb',
    day: 16,
    description: 'Great Night of Shiva at Koneswaram, Munneswaram & Thiruketheeswaram.'
  },
  {
    name: 'Medin Full Moon Poya Day',
    type: 'Poya',
    date: '2026-03-13',
    month: 'Mar',
    day: 13,
    description: 'Buddha’s historical journey to Kimbulwathpura to meet father King Suddhodana.'
  },
  {
    name: 'Eid-ul-Fitr (Ramazan Festival)',
    type: 'Festival',
    date: '2026-03-20',
    month: 'Mar',
    day: 20,
    description: 'Islamic festival marking the end of holy fasting month of Ramadan.'
  },
  {
    name: 'Bak Full Moon Poya Day',
    type: 'Poya',
    date: '2026-04-11',
    month: 'Apr',
    day: 11,
    description: 'Buddha’s second visit to Sri Lanka to settle conflict between Chulodara and Mahodara.'
  },
  {
    name: 'Sinhala & Tamil New Year (Aluth Avurudda)',
    type: 'Festival',
    date: '2026-04-13',
    endDate: '2026-04-14',
    month: 'Apr',
    day: 13,
    description: 'Traditional astrological Solar New Year with folk games, fireworks and sweets.'
  },
  {
    name: 'Good Friday & Easter',
    type: 'Public',
    date: '2026-04-03',
    month: 'Apr',
    day: 3,
    description: 'Christian remembrance and celebrations at St. Anthony’s & Madhu Shrine.'
  },
  {
    name: 'May Day (Workers’ Day)',
    type: 'Public',
    date: '2026-05-01',
    month: 'May',
    day: 1,
    description: 'International Workers Day statutory public and bank holiday.'
  },
  {
    name: 'Vesak Full Moon Poya (Sacred 2-Day)',
    type: 'Poya',
    date: '2026-05-11',
    endDate: '2026-05-12',
    month: 'May',
    day: 11,
    description: 'Triple sacred celebration of Buddha’s Birth, Enlightenment and Parinirvana. Colorful Pandols & Dansal.'
  },
  {
    name: 'Poson Full Moon Poya Day',
    type: 'Poya',
    date: '2026-06-09',
    month: 'Jun',
    day: 9,
    description: 'Arrival of Arahat Mahinda introducing Buddhism to Sri Lanka at Mihintale Rock.'
  },
  {
    name: 'Eid-ul-Adha (Hajj Festival)',
    type: 'Festival',
    date: '2026-05-27',
    month: 'May',
    day: 27,
    description: 'Holy feast of sacrifice honoring Abraham’s devotion.'
  },
  {
    name: 'Kataragama Esala Festival',
    type: 'Festival',
    date: '2026-07-15',
    endDate: '2026-07-29',
    month: 'Jul',
    day: 15,
    description: 'Multi-faith sacred Kataragama Pada Yatra pilgrimage, kavadi and fire-walking rituals.',
    affectedSites: ['kataragama', 'site-kataragama', 'kataragama-temple']
  },
  {
    name: 'Esala Full Moon Poya & Kandy Perahera',
    type: 'Festival',
    date: '2026-07-29',
    month: 'Jul',
    day: 29,
    description: 'Grand Esala Perahera of the Sacred Tooth Relic with fire dancers & tusker.',
    affectedSites: ['temple-of-tooth', 'kandy', 'site-kandy']
  },
  {
    name: 'Nallur Kandaswamy Festival (Jaffna)',
    type: 'Festival',
    date: '2026-08-16',
    endDate: '2026-09-08',
    month: 'Aug',
    day: 16,
    description: '25-day vibrant chariot & deity procession attracting global Hindu diaspora to Jaffna Nallur Kovil.',
    affectedSites: ['nallur-kovil', 'jaffna-fort', 'site-jaffna', 'site-nallur']
  },
  {
    name: 'Nikini Full Moon Poya Day',
    type: 'Poya',
    date: '2026-08-27',
    month: 'Aug',
    day: 27,
    description: 'First Sangha Dhamma council held under Maha Kassapa Thero.'
  },
  {
    name: 'Binara Full Moon Poya Day',
    type: 'Poya',
    date: '2026-09-25',
    month: 'Sep',
    day: 25,
    description: 'Commemorates the establishment of the Bhikkhuni Sasana (Order of Nuns).'
  },
  {
    name: 'Vap Full Moon Poya Day',
    type: 'Poya',
    date: '2026-10-25',
    month: 'Oct',
    day: 25,
    description: 'Culmination of the Vassana rain-retreat season and beginning of Katina Cheewara offerings.'
  },
  {
    name: 'Deepavali Festival of Lights',
    type: 'Festival',
    date: '2026-11-08',
    month: 'Nov',
    day: 8,
    description: 'Hindu triumph of light over darkness with traditional clay lamps and sweets.'
  },
  {
    name: 'Il Full Moon Poya Day',
    type: 'Poya',
    date: '2026-11-23',
    month: 'Nov',
    day: 23,
    description: 'First 60 Buddhist missionaries dispatched; Sri Pada pilgrimage season opening.'
  },
  {
    name: 'Unduvap Full Moon Poya Day',
    type: 'Poya',
    date: '2026-12-23',
    month: 'Dec',
    day: 23,
    description: 'Arrival of Sanghamitta Theri bringing the Sacred Jaya Sri Maha Bodhi sapling.'
  },
  {
    name: 'Christmas Day',
    type: 'Public',
    date: '2026-12-25',
    month: 'Dec',
    day: 25,
    description: 'Celebration of the Nativity of Jesus Christ across all Sri Lankan churches.'
  }
];

/**
 * Returns current Sri Lanka Standard Time (Asia/Colombo, UTC+5:30)
 */
export function getSriLankaTime(): {
  timeStr: string;
  timeWithSeconds: string;
  dateStr: string;
  dayOfWeek: string;
  isNight: boolean;
  hour: number;
  minute: number;
  isPoyaDay: boolean;
  isHolidayToday: boolean;
  todayIso: string; // YYYY-MM-DD
  rawDate: Date;
} {
  const now = new Date();
  const optionsTime: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Colombo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  const optionsTimeSec: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Colombo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  const optionsDate: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Colombo',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  const optionsDay: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Colombo',
    weekday: 'long'
  };
  const optionsHour: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Colombo',
    hour: 'numeric',
    hour12: false
  };
  const optionsMinute: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Colombo',
    minute: 'numeric'
  };

  const timeStr = new Intl.DateTimeFormat('en-US', optionsTime).format(now);
  const timeWithSeconds = new Intl.DateTimeFormat('en-US', optionsTimeSec).format(now);
  const dateStr = new Intl.DateTimeFormat('en-US', optionsDate).format(now);
  const dayOfWeek = new Intl.DateTimeFormat('en-US', optionsDay).format(now);
  const hour = parseInt(new Intl.DateTimeFormat('en-US', optionsHour).format(now), 10);
  const minute = parseInt(new Intl.DateTimeFormat('en-US', optionsMinute).format(now), 10) || 0;
  const isNight = hour < 6 || hour >= 18;

  // Format today's YYYY-MM-DD in Asia/Colombo
  const formatterIso = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const todayIso = formatterIso.format(now); // e.g. "2026-08-28"

  // Check if today matches any Poya day or active holiday/festival
  const activeEvent = SRI_LANKA_HOLIDAYS_AND_FESTIVALS.find((h) => {
    if (h.endDate) {
      return todayIso >= h.date && todayIso <= h.endDate;
    }
    return h.date === todayIso;
  });

  const isPoyaDay = activeEvent?.type === 'Poya';
  const isHolidayToday = Boolean(activeEvent);

  return {
    timeStr,
    timeWithSeconds,
    dateStr,
    dayOfWeek,
    isNight,
    hour,
    minute,
    isPoyaDay,
    isHolidayToday,
    todayIso,
    rawDate: now
  };
}

/**
 * Finds the active Sri Lankan holiday/festival for today or the next chronological upcoming holiday
 */
export function getUpcomingHolidayOrFestival(): {
  current?: SriLankaHoliday;
  next: SriLankaHoliday;
  daysUntilNext: number;
  isTodayHoliday: boolean;
} {
  const sl = getSriLankaTime();
  const todayIso = sl.todayIso;

  // 1. Find if today is an active holiday or festival
  const current = SRI_LANKA_HOLIDAYS_AND_FESTIVALS.find((h) => {
    if (h.endDate) {
      return todayIso >= h.date && todayIso <= h.endDate;
    }
    return h.date === todayIso;
  });

  // 2. Find next chronological holiday in future
  const futureHolidays = SRI_LANKA_HOLIDAYS_AND_FESTIVALS.filter(
    (h) => (h.endDate ? h.endDate > todayIso : h.date > todayIso)
  ).sort((a, b) => a.date.localeCompare(b.date));

  const next = futureHolidays[0] || SRI_LANKA_HOLIDAYS_AND_FESTIVALS[0];

  // Calculate days until next holiday
  const todayDateObj = new Date(todayIso + 'T00:00:00');
  const nextDateObj = new Date(next.date + 'T00:00:00');
  const diffTime = Math.max(0, nextDateObj.getTime() - todayDateObj.getTime());
  const daysUntilNext = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    current,
    next,
    daysUntilNext,
    isTodayHoliday: Boolean(current)
  };
}
