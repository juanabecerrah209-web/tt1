import { useState } from 'react';
import type { Pick } from '../types';
import { computeParlayOdds } from '../api/predictions';
import { formatOdds, formatTime, confidenceColor, confidenceBg, sportIcon } from '../utils';

interface Props {
  picks: Pick[];
  loading: boolean;
}

export default function ParlayTab({ picks, loading }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set([0, 1, 2]));

  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const selectedPicks = picks.filter((_, i) => selected.has(i));
  const parlayOdds = selectedPicks.length >= 2
    ? computeParlayOdds(selectedPicks.map((p) => p.odds))
    : null;

  const combinedConfidence = selectedPicks.length > 0
    ? Math.round(selectedPicks.reduce((acc, p) => acc * (p.confidence / 100), 1) * 100)
    : 0;

  const payout100 = parlayOdds !== null
    ? (parlayOdds > 0 ? parlayOdds : 100 / Math.abs(parlayOdds) * 100)
    : 0;

  if (loading) {
    return (
      <div className="loading-grid">
        {[1, 2, 3].map((i) => <div key={i} className="card skeleton" />)}
      </div>
    );
  }

  return (
    <div className="parlay-layout">
      <div className="parlay-builder">
        <div className="section-header">
          <h2>Build Your Parlay</h2>
          <p className="section-sub">Select 2+ picks to build a parlay. AI recommends the top 3.</p>
        </div>

        <div className="picks-list">
          {picks.map((pick, i) => {
            const isSelected = selected.has(i);
            return (
              <div
                key={i}
                className={`parlay-leg ${isSelected ? 'leg-selected' : ''}`}
                onClick={() => toggle(i)}
              >
                <div className="leg-check">
                  {isSelected ? '✓' : '○'}
                </div>
                <div className="leg-info">
                  <div className="leg-header">
                    <span className="sport-icon">{sportIcon(pick.sport)}</span>
                    <span className="sport-tag">{pick.sport}</span>
                    <span className="time-tag">{formatTime(pick.commenceTime)}</span>
                  </div>
                  <div className="leg-matchup">{pick.game}</div>
                  <div className="leg-pick-row">
                    <span className="leg-team">{pick.team}</span>
                    <span className={`leg-odds ${pick.odds > 0 ? 'positive' : 'negative'}`}>
                      {formatOdds(pick.odds)}
                    </span>
                    <span className="book-tag">{pick.bookmaker}</span>
                  </div>
                  <div className="leg-confidence">
                    <div className="confidence-bar-wrap small">
                      <div
                        className="confidence-bar"
                        style={{ width: `${pick.confidence}%`, background: confidenceBg(pick.confidence) }}
                      />
                    </div>
                    <span className={`confidence-pct ${confidenceColor(pick.confidence)}`}>
                      {pick.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="parlay-summary-col">
        <div className="parlay-card sticky-card">
          <div className="parlay-title">
            {selectedPicks.length}-Leg Parlay
          </div>

          {selectedPicks.length < 2 ? (
            <p className="parlay-hint">Select at least 2 picks to build a parlay</p>
          ) : (
            <>
              <div className="parlay-legs-list">
                {selectedPicks.map((p, i) => (
                  <div key={i} className="parlay-summary-leg">
                    <span className="ps-team">{p.team.split(' ').slice(-1)[0]}</span>
                    <span className={`ps-odds ${p.odds > 0 ? 'positive' : 'negative'}`}>
                      {formatOdds(p.odds)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="parlay-divider" />

              <div className="parlay-stat">
                <span>Combined Odds</span>
                <span className={`big-odds ${(parlayOdds ?? 0) > 0 ? 'positive' : 'negative'}`}>
                  {parlayOdds !== null ? formatOdds(parlayOdds) : '—'}
                </span>
              </div>

              <div className="parlay-stat">
                <span>$100 wins</span>
                <span className="payout">${Math.round(payout100)}</span>
              </div>

              <div className="parlay-stat">
                <span>Hit Probability</span>
                <span className={`hit-prob ${confidenceColor(combinedConfidence)}`}>
                  ~{combinedConfidence}%
                </span>
              </div>

              <div className="parlay-ev">
                <span className="ev-label">Expected Value</span>
                <span className={`ev-value ${combinedConfidence > 30 ? 'ev-pos' : 'ev-neg'}`}>
                  {combinedConfidence > 30 ? '+EV' : '-EV'}
                </span>
              </div>

              <div className="ai-rec">
                <span className="ai-icon">🤖</span>
                <span className="ai-text">
                  {combinedConfidence > 25
                    ? `AI recommends this ${selectedPicks.length}-leg parlay. Combined confidence is above threshold.`
                    : `Consider removing the lowest confidence leg to improve hit rate.`}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
