export const mockAdminMetrics = {
  kpis: {
    activeSites: 24,
    predictions24h: 1440,
    successfulNudges: 68, // percentage
    avgMae: 6.2 // percentage
  },
  predictedVsActual: Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const actual = 4500 + Math.random() * 1000;
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      actual: Math.round(actual),
      predicted: Math.round(actual + (Math.random() - 0.4) * 400) // Slight divergence
    };
  }),
  lossCurve: Array.from({ length: 50 }, (_, i) => ({
    epoch: i + 1,
    trainLoss: 0.8 * Math.exp(-i / 10) + 0.1 + Math.random() * 0.05,
    valLoss: 0.8 * Math.exp(-i / 12) + 0.15 + Math.random() * 0.08
  })),
  funnel: [
  { stage: 'Nudges Sent', count: 12500 },
  { stage: 'Viewed', count: 9800 },
  { stage: 'Accepted', count: 4200 },
  { stage: 'Visited Alt Site', count: 3150 }],

  // 7 days x 24 hours heatmap data (0-100 intensity)
  hourlyHeatmap: Array.from({ length: 7 }, () =>
  Array.from({ length: 24 }, (_, hour) => {
    // Peak around 10am-4pm
    const isPeak = hour >= 10 && hour <= 16;
    return Math.round(Math.random() * (isPeak ? 100 : 30));
  })
  )
};