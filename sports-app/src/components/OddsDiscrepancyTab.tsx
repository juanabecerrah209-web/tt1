import type { OddsDiscrepancy } from '../types';
import { formatOdds, formatTime, sportIcon } from '../utils';

interface Props {
  discrepancies: OddsDiscrepancy[];
  loading: boolean;
}

export default function OddsDiscrepancyTab({ discrepancies, loading }: Props) {
  if (loading) {
    return (
      <div className="loading-grid">
        {[1, 2, 3, 4].map((i) => <div key={i} className="card skeleton" />)}
      </div>
    );
  }

  if (discrepancies.length === 0) {
    return <div className="empty">No significant odds discrepancies found.</div>;
  }

  const topEdge = discrepancies[0];

  return (
    <div className="disc-layout">
      <div className="disc-info-box">
        <div className="info-icon">💡</div>
        <div className="info-text">
          <strong>What is an odds discrepancy?</strong> When different sportsbooks price the same outcome
          differently, you can maximize your payout by shopping for the best line. Large gaps may
          also signal sharp money or early market inefficiencies.
        </div>
      </div>

      {topEdge && (
        <div className="card top-disc-card">
          <div className="badge arb-badge">BEST LINE SHOP TODAY</div>
          <div className="disc-header">
            <span className="sport-icon">{sportIcon(topEdge.sport)}</span>
            <span className="sport-tag">{topEdge.sport}</span>
            <span className="time-tag">{formatTime(topEdge.commenceTime)}</span>
          </div>
          <div className="matchup">{topEdge.game}</div>
          <div className="disc-team">Pick: <strong>{topEdge.team}</strong></div>
          <div className="disc-compare">
            <div className="disc-book best-book">
              <div className="book-label">BEST BOOK</div>
              <div className="book-name">{topEdge.bestBook}</div>
              <div className={`book-odds ${topEdge.bestOdds > 0 ? 'positive' : 'negative'}`}>
                {formatOdds(topEdge.bestOdds)}
              </div>
              <div className="impl-prob">{topEdge.impliedProbBest.toFixed(1)}% implied</div>
            </div>
            <div className="disc-vs">VS</div>
            <div className="disc-book worst-book">
              <div className="book-label">WORST BOOK</div>
              <div className="book-name">{topEdge.worstBook}</div>
              <div className={`book-odds ${topEdge.worstOdds > 0 ? 'positive' : 'negative'}`}>
                {formatOdds(topEdge.worstOdds)}
              </div>
              <div className="impl-prob">{topEdge.impliedProbWorst.toFixed(1)}% implied</div>
            </div>
          </div>
          <div className="edge-row">
            <div className="edge-stat">
              <span className="edge-label">Line Gap</span>
              <span className="edge-value">{topEdge.discrepancyPct.toFixed(1)}%</span>
            </div>
            <div className="edge-stat">
              <span className="edge-label">Edge</span>
              <span className="edge-value highlight">{topEdge.edge.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="disc-table-wrap">
        <table className="disc-table">
          <thead>
            <tr>
              <th>Game</th>
              <th>Pick</th>
              <th>Sport</th>
              <th>Best</th>
              <th>Worst</th>
              <th>Gap</th>
              <th>Edge</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {discrepancies.map((d, i) => (
              <tr key={i} className={i === 0 ? 'top-row' : ''}>
                <td className="game-cell">{d.game}</td>
                <td className="team-cell">{d.team}</td>
                <td>
                  <span className="sport-icon">{sportIcon(d.sport)}</span> {d.sport}
                </td>
                <td>
                  <span className={`odds-chip ${d.bestOdds > 0 ? 'positive' : 'negative'}`}>
                    {formatOdds(d.bestOdds)}
                  </span>
                  <span className="chip-book">{d.bestBook}</span>
                </td>
                <td>
                  <span className={`odds-chip faded ${d.worstOdds > 0 ? 'positive' : 'negative'}`}>
                    {formatOdds(d.worstOdds)}
                  </span>
                  <span className="chip-book">{d.worstBook}</span>
                </td>
                <td className="gap-cell">{d.discrepancyPct.toFixed(1)}%</td>
                <td className="edge-cell">
                  <span className={`edge-badge ${d.edge > 2 ? 'edge-high' : d.edge > 1 ? 'edge-med' : 'edge-low'}`}>
                    {d.edge.toFixed(2)}%
                  </span>
                </td>
                <td className="time-cell">{formatTime(d.commenceTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
