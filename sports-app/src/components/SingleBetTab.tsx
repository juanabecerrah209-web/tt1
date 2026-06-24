import type { Pick } from '../types';
import { formatOdds, formatTime, confidenceColor, confidenceBg, sportIcon } from '../utils';

interface Props {
  picks: Pick[];
  loading: boolean;
}

export default function SingleBetTab({ picks, loading }: Props) {
  if (loading) {
    return (
      <div className="loading-grid">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="card skeleton" />
        ))}
      </div>
    );
  }

  if (picks.length === 0) {
    return <div className="empty">No picks available. Try refreshing.</div>;
  }

  return (
    <div className="picks-grid">
      {picks.map((pick, i) => (
        <div key={i} className={`card pick-card ${i === 0 ? 'top-pick' : ''}`}>
          {i === 0 && <div className="badge top-badge">TOP PICK OF THE DAY</div>}
          <div className="card-header">
            <span className="sport-icon">{sportIcon(pick.sport)}</span>
            <span className="sport-tag">{pick.sport}</span>
            <span className="time-tag">{formatTime(pick.commenceTime)}</span>
          </div>

          <div className="matchup">{pick.game}</div>

          <div className="pick-row">
            <div className="pick-team">
              <span className="label">PICK</span>
              <span className="team-name">{pick.team}</span>
            </div>
            <div className="pick-odds">
              <span className="label">BEST ODDS</span>
              <span className={`odds-value ${pick.odds > 0 ? 'positive' : 'negative'}`}>
                {formatOdds(pick.odds)}
              </span>
              <span className="book-tag">{pick.bookmaker}</span>
            </div>
          </div>

          <div className="confidence-row">
            <span className="label">CONFIDENCE</span>
            <div className="confidence-bar-wrap">
              <div
                className="confidence-bar"
                style={{
                  width: `${pick.confidence}%`,
                  background: confidenceBg(pick.confidence),
                }}
              />
            </div>
            <span className={`confidence-pct ${confidenceColor(pick.confidence)}`}>
              {pick.confidence}%
            </span>
          </div>

          <p className="reasoning">{pick.reasoning}</p>

          {pick.sentiment && (
            <div className="sentiment-row">
              <span className="sentiment-icon">📊</span>
              <span className="sentiment-text">
                Community bullish on <strong>{pick.sentiment.bullishTeam.split(' ').pop()}</strong>
                {' '}· {pick.sentiment.posts} forum posts analyzed
              </span>
            </div>
          )}

          {pick.sentiment?.topPost && (
            <div className="top-post">
              <span className="label">TOP REDDIT POST</span>
              <p>"{pick.sentiment.topPost}"</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
