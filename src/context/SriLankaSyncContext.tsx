import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { getLiveSiteWeather, type LiveSiteWeather } from '../lib/liveWeather';
import { computeSiteDayNightStatus, generateDayNightLSTMData } from '../lib/operatingHours';
import { getSitesLive, type LiveSite, type LiveNudge } from '../lib/api';

export interface SriLankaTimeState {
  hour: number;
  minute: number;
  second: number;
  decimalHour: number;
  timeStr: string;
  timeWithSeconds: string;
  dateStr: string;
  dayOfWeek: string;
  isNight: boolean;
  isSunriseWindow: boolean;
  isSunsetWindow: boolean;
  isPoyaDay: boolean;
  holidayName?: string;
}

export interface SriLankaSyncContextValue {
  timeState: SriLankaTimeState;
  weatherMap: Record<string, LiveSiteWeather>;
  sites: LiveSite[];
  dynamicNudges: LiveNudge[];
  isLoading: boolean;
  isWeatherLoading: boolean;
  refreshAll: () => Promise<void>;
  getSiteDynamicStatus: (site: LiveSite) => {
    isOpen: boolean;
    effectiveDensity: number;
    operatingHours: string;
    statusLabel: string;
    statusBadge: 'open' | 'closed' | 'closing-soon' | 'night-active';
    crowdLevel: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Closed';
    weather: { temp: number; condition: string };
  };
}

const SriLankaSyncContext = createContext<SriLankaSyncContextValue | null>(null);

function getSriLankaTimeState(): SriLankaTimeState {
  const now = new Date();
  // Get time in Asia/Colombo time zone
  const colomboFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo',
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const parts = colomboFormatter.formatToParts(now);
  const partMap: Record<string, string> = {};
  parts.forEach((p) => {
    partMap[p.type] = p.value;
  });

  const hour = parseInt(partMap.hour || '0', 10);
  const minute = parseInt(partMap.minute || '0', 10);
  const second = parseInt(partMap.second || '0', 10);
  const decimalHour = hour + minute / 60;
  const dayOfWeek = partMap.weekday || 'Thursday';

  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const timeStr = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period} SLST`;
  const timeWithSeconds = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')} ${period}`;
  const dateStr = `${dayOfWeek}, ${partMap.month} ${partMap.day}, ${partMap.year}`;

  const isNight = hour >= 18 || hour < 6;
  const isSunriseWindow = decimalHour >= 5.0 && decimalHour <= 7.0;
  const isSunsetWindow = decimalHour >= 17.0 && decimalHour <= 18.75;

  // Simple Sri Lankan Lunar / Poya cycle check
  const dayNum = parseInt(partMap.day || '1', 10);
  const isPoyaDay = dayNum === 15 || dayNum === 16;
  const holidayName = isPoyaDay ? 'Nikini Full Moon Poya Day' : undefined;

  return {
    hour,
    minute,
    second,
    decimalHour,
    timeStr,
    timeWithSeconds,
    dateStr,
    dayOfWeek,
    isNight,
    isSunriseWindow,
    isSunsetWindow,
    isPoyaDay,
    holidayName
  };
}

export function SriLankaSyncProvider({ children }: { children: React.ReactNode }) {
  const [timeState, setTimeState] = useState<SriLankaTimeState>(getSriLankaTimeState);
  const [rawSites, setRawSites] = useState<LiveSite[]>([]);
  const [weatherMap, setWeatherMap] = useState<Record<string, LiveSiteWeather>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeState(getSriLankaTimeState());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial sites and real weather
  const loadSitesAndWeather = useCallback(async () => {
    try {
      setIsLoading(true);
      const live = await getSitesLive();
      setRawSites(live);

      // Fetch live weather from Open-Meteo for key coordinates
      setIsWeatherLoading(true);
      const weatherResults: Record<string, LiveSiteWeather> = {};

      // Batch unique coordinates
      const coordBatches: Array<{ key: string; lat: number; lng: number }> = [];
      live.forEach((site) => {
        const key = `${site.lat.toFixed(2)},${site.lng.toFixed(2)}`;
        if (!coordBatches.find((c) => c.key === key)) {
          coordBatches.push({ key, lat: site.lat, lng: site.lng });
        }
      });

      await Promise.allSettled(
        coordBatches.slice(0, 15).map(async (c) => {
          const w = await getLiveSiteWeather(c.lat, c.lng);
          weatherResults[c.key] = w;
        })
      );

      setWeatherMap(weatherResults);
    } catch (err) {
      console.warn('[SriLankaSync] Live fetch warning:', err);
    } finally {
      setIsLoading(false);
      setIsWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSitesAndWeather();
    // Refresh weather & data every 5 minutes
    const refreshTimer = setInterval(() => {
      void loadSitesAndWeather();
    }, 5 * 60 * 1000);
    return () => clearInterval(refreshTimer);
  }, [loadSitesAndWeather]);

  // Compute dynamic status helper
  const getSiteDynamicStatus = useCallback(
    (site: LiveSite) => {
      const coordKey = `${site.lat.toFixed(2)},${site.lng.toFixed(2)}`;
      const liveWeather = weatherMap[coordKey];

      const weather = liveWeather
        ? { temp: liveWeather.temp, condition: liveWeather.condition }
        : site.weather || { temp: 28, condition: 'Sunny' };

      const baseRawDensity = site.currentDensity ?? 65;
      const status = computeSiteDayNightStatus(
        site.name,
        site.category || site.sltdaCategory || '',
        baseRawDensity,
        true
      );

      return {
        isOpen: status.isOpen,
        effectiveDensity: status.effectiveDensity,
        operatingHours: status.operatingHours,
        statusLabel: status.statusLabel,
        statusBadge: status.statusBadge,
        crowdLevel: status.crowdLevel,
        weather
      };
    },
    [weatherMap]
  );

  // Sites with dynamically synced day/night crowd, forecast and live weather
  const sites = useMemo(() => {
    return rawSites.map((site) => {
      const dynamic = getSiteDynamicStatus(site);
      return {
        ...site,
        currentDensity: dynamic.effectiveDensity,
        isOpen: dynamic.isOpen,
        operatingHours: dynamic.operatingHours,
        statusLabel: dynamic.statusLabel,
        statusBadge: dynamic.statusBadge,
        crowdLevel: dynamic.crowdLevel,
        weather: dynamic.weather,
        forecastData: generateDayNightLSTMData(
          site.name,
          site.category || site.sltdaCategory || '',
          site.threshold || 75,
          site.trend,
          true
        )
      };
    });
  }, [rawSites, getSiteDynamicStatus]);

  // Dynamically generated real-time smart nudges based on SL time, open/closed status & real congestion
  const dynamicNudges = useMemo<LiveNudge[]>(() => {
    const list: LiveNudge[] = [];
    const isNight = timeState.isNight;

    if (isNight) {
      // 1. Nighttime redirection nudge for closed heritage/museums
      const closedDaySite = sites.find((s) => !s.isOpen && /Museum|Fortress|Botanical/i.test(s.name));
      const openNightSite = sites.find((s) => s.isOpen && /Galle Face|Temple|Street|Market/i.test(s.name));

      if (closedDaySite && openNightSite) {
        list.push({
          id: 'nudge-night-01',
          originalSiteId: closedDaySite.id,
          altSiteId: openNightSite.id,
          originalSiteName: closedDaySite.name,
          altSiteName: openNightSite.name,
          reason: `${closedDaySite.name} is closed for the evening (${closedDaySite.operatingHours}). ${openNightSite.name} is open for night exploration with scenic illumination and street dining.`,
          incentive: '+50 PathPoints & Free Tea Voucher',
          distanceKm: 3.2,
          travelTimeMin: 12,
          status: 'pending',
          badge: 'Night Active',
          createdAt: new Date().toISOString()
        });
      }

      // 2. Evening cultural & dining nudge
      list.push({
        id: 'nudge-night-02',
        originalSiteId: sites[0]?.id || 's1',
        altSiteId: sites.find((s) => /Gangaramaya|Temple of the Tooth/i.test(s.name))?.id || sites[1]?.id || 's2',
        originalSiteName: 'Central Heritage Trail',
        altSiteName: 'Gangaramaya Evening Illumination',
        reason: 'Night Puja ceremony and tranquil illuminated lakeside walk at Beira Lake.',
        incentive: '15% Off Nearby Artisan Cafe',
        distanceKm: 2.1,
        travelTimeMin: 8,
        status: 'pending',
        badge: 'Evening Cultural',
        createdAt: new Date().toISOString()
      });
    } else {
      // Daytime dynamic congestion nudges
      const congested = sites.filter((s) => s.isOpen && s.currentDensity >= (s.threshold || 75));
      const uncongested = sites.filter((s) => s.isOpen && s.currentDensity < 50);

      congested.slice(0, 3).forEach((highSite, idx) => {
        const alt = uncongested[idx % uncongested.length] || sites[(idx + 1) % sites.length];
        if (alt && alt.id !== highSite.id) {
          list.push({
            id: `nudge-day-${highSite.id}-${idx}`,
            originalSiteId: highSite.id,
            altSiteId: alt.id,
            originalSiteName: highSite.name,
            altSiteName: alt.name,
            reason: `${highSite.name} is experiencing peak tourist density (${highSite.currentDensity}%). Diverting to ${alt.name} (${alt.currentDensity}% density) provides open panoramic views and zero wait times.`,
            incentive: '+60 PathPoints & Priority FastTrack',
            distanceKm: 4.8,
            travelTimeMin: 15,
            status: 'pending',
            badge: 'Avoid Queue',
            createdAt: new Date().toISOString()
          });
        }
      });

      // Default daytime scenic nudge if no site is over threshold
      if (list.length === 0 && sites.length >= 2) {
        list.push({
          id: 'nudge-day-default',
          originalSiteId: sites[0].id,
          altSiteId: sites[1].id,
          originalSiteName: sites[0].name,
          altSiteName: sites[1].name,
          reason: `Optimal weather window (${sites[1].weather?.temp ?? 28}°C ${sites[1].weather?.condition ?? 'Sunny'}) at ${sites[1].name} with light tourist traffic.`,
          incentive: '+40 PathPoints',
          distanceKm: 3.5,
          travelTimeMin: 10,
          status: 'pending',
          badge: 'Optimal Window',
          createdAt: new Date().toISOString()
        });
      }
    }

    return list;
  }, [sites, timeState.isNight]);

  return (
    <SriLankaSyncContext.Provider
      value={{
        timeState,
        weatherMap,
        sites,
        dynamicNudges,
        isLoading,
        isWeatherLoading,
        refreshAll: loadSitesAndWeather,
        getSiteDynamicStatus
      }}
    >
      {children}
    </SriLankaSyncContext.Provider>
  );
}

export function useSriLankaSync() {
  const context = useContext(SriLankaSyncContext);
  if (!context) {
    throw new Error('useSriLankaSync must be used within a SriLankaSyncProvider');
  }
  return context;
}
