import { useEffect, useState, useCallback } from 'react';
import type { Pick, OddsDiscrepancy, SentimentData, OddsGame } from './types';
import { fetchLiveOdds } from './api/odds';
import { fetchRedditPosts, analyzeSentiment } from './api/reddit';
import { generatePicks, computeOddsDiscrepancies } from './api/predictions';
import SingleBetTab from './components/SingleBetTab';
import ParlayTab from './components/ParlayTab';
import OddsDiscrepancyTab from './components/OddsDiscrepancyTab';
import './App.css';

type Tab = 'single' | 'parlay' | 'discrepancy';

export default function App() {
  const [tab, setTab] = useState<Tab>('single');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [discrepancies, setDiscrepancies] = useState<OddsDiscrepancy[]>([]);
  const [games, setGames] = useState<OddsGame[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rawGames = await fetchLiveOdds();
      setGames(rawGames);

      const sentimentMap = new Map<string, SentimentData>();
      await Promise.all(
        rawGames.map(async (game) => {
          const query = `${game.home_team} ${game.away_team}`;
          const posts = await fetchRedditPosts(query);
          const sentiment = analyzeSentiment(posts, game.home_team, game.away_team);
          sentimentMap.set(game.id, sentiment);
        })
      );

      const computedPicks = generatePicks(rawGames, sentimentMap);
      const computedDisc = computeOddsDiscrepancies(rawGames);
      setPicks(computedPicks);
      setDiscrepancies(computedDisc);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const tabDefs: { key: Tab; label: string; icon: string }[] = [
    { key: 'single', label: 'Single Bets', icon: '🎯' },
    { key: 'parlay', label: 'Parlay Builder', icon: '🔗' },
    { key: 'discrepancy', label: 'Odds Discrepancy', icon: '📈' },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🏆</span>
            <div>
              <span className="logo-title">SportsPick AI</span>
              <span className="logo-sub">Reddit · Forums · Live Odds</span>
            </div>
          </div>
          <div className="header-right">
            {lastUpdated && (
              <span className="last-updated">
                Updated {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
            )}
            <button className="refresh-btn" onClick={load} disabled={loading}>
              {loading ? '⟳ Refreshing...' : '⟳ Refresh'}
            </button>
          </div>
        </div>
        <div className="sources-bar">
          <span className="source-chip">📡 Reddit</span>
          <span className="source-chip">💬 Forums</span>
          <span className="source-chip">📊 Live Odds (The Odds API)</span>
          <span className="source-chip">🤖 AI Analysis</span>
        </div>
      </header>

      <nav className="tab-nav">
        {tabDefs.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`tab-btn ${tab === key ? 'tab-active' : ''}`}
            onClick={() => setTab(key)}
          >
            <span className="tab-icon">{icon}</span>
            <span className="tab-label">{label}</span>
            {key === 'single' && picks.length > 0 && (
              <span className="tab-count">{picks.length}</span>
            )}
            {key === 'discrepancy' && discrepancies.length > 0 && (
              <span className="tab-count">{discrepancies.length}</span>
            )}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {tab === 'single' && <SingleBetTab picks={picks} loading={loading} />}
        {tab === 'parlay' && <ParlayTab picks={picks} loading={loading} />}
        {tab === 'discrepancy' && <OddsDiscrepancyTab discrepancies={discrepancies} loading={loading} />}
      </main>

      <footer className="app-footer">
        <p>
          ⚠️ For entertainment purposes only. Not financial or gambling advice.
          Data from Reddit public API and The Odds API.{' '}
          {games.length > 0 && `${games.length} games analyzed.`}
        </p>
        <p className="api-note">
          Add real odds: set <code>VITE_ODDS_API_KEY</code> in <code>.env</code> (free at the-odds-api.com)
        </p>
      </footer>
    </div>
  );
}
