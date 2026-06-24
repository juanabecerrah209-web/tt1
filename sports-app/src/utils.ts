export function formatOdds(american: number): string {
  return american > 0 ? `+${american}` : `${american}`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

export function confidenceColor(pct: number): string {
  if (pct >= 65) return 'conf-high';
  if (pct >= 45) return 'conf-mid';
  return 'conf-low';
}

export function confidenceBg(pct: number): string {
  if (pct >= 65) return 'linear-gradient(90deg, #22c55e, #16a34a)';
  if (pct >= 45) return 'linear-gradient(90deg, #f59e0b, #d97706)';
  return 'linear-gradient(90deg, #ef4444, #dc2626)';
}

export function sportIcon(sport: string): string {
  const s = sport.toLowerCase();
  if (s.includes('nba') || s.includes('basketball')) return '🏀';
  if (s.includes('nfl') || s.includes('football')) return '🏈';
  if (s.includes('mlb') || s.includes('baseball')) return '⚾';
  if (s.includes('nhl') || s.includes('hockey')) return '🏒';
  if (s.includes('soccer') || s.includes('mls')) return '⚽';
  return '🏆';
}
