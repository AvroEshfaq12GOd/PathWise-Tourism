export interface TimeSeriesPoint {
  time: string;
  density: number;
  isForecast: boolean;
  lowerBound?: number;
  upperBound?: number;
}

export function generateLSTMData(
baseDensity: number,
trend: 'up' | 'down' | 'stable')
: TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  const now = new Date();
  now.setMinutes(0, 0, 0);

  // Generate 20 hours of history
  for (let i = 20; i > 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    // Add some sine wave daily seasonality + noise
    const hour = t.getHours();
    const seasonality = Math.sin((hour - 8) * Math.PI / 12) * 30; // Peak around 2 PM
    const noise = (Math.random() - 0.5) * 10;

    let val = baseDensity + seasonality + noise;
    if (trend === 'up') val -= i * 1.5;
    if (trend === 'down') val += i * 1.5;

    data.push({
      time: `${t.getHours().toString().padStart(2, '0')}:00`,
      density: Math.max(10, Math.min(100, Math.round(val))),
      isForecast: false
    });
  }

  // Generate 4 hours of forecast
  let lastVal = data[data.length - 1].density;
  for (let i = 0; i <= 4; i++) {
    const t = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hour = t.getHours();
    const seasonality = Math.sin((hour - 8) * Math.PI / 12) * 30;

    let forecastVal = lastVal + seasonality * 0.2; // Smoother forecast
    if (trend === 'up') forecastVal += 5;
    if (trend === 'down') forecastVal -= 5;

    forecastVal = Math.max(10, Math.min(100, Math.round(forecastVal)));

    data.push({
      time: `${t.getHours().toString().padStart(2, '0')}:00`,
      density: forecastVal,
      isForecast: true,
      lowerBound: Math.max(0, forecastVal - (i * 3 + 2)),
      upperBound: Math.min(100, forecastVal + (i * 3 + 2))
    });
    lastVal = forecastVal;
  }

  return data;
}