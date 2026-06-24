import type { OddsGame, Pick, OddsDiscrepancy, SentimentData } from '../types';

export function americanToDecimal(american: number): number {
  if (american > 0) return (american / 100) + 1;
  return (100 / Math.abs(american)) + 1;
}

export function decimalToImpliedProb(decimal: number): number {
  return 1 / decimal;
}

export function americanToImpliedProb(american: number): number {
  return decimalToImpliedProb(americanToDecimal(american));
}

export function getBestOdds(game: OddsGame, team: string): { price: number; bookmaker: string } | null {
  let best: { price: number; bookmaker: string } | null = null;

  for (const bm of game.bookmakers) {
    const market = bm.markets.find((m) => m.key === 'h2h');
    if (!market) continue;
    const outcome = market.outcomes.find((o) => o.name === team);
    if (!outcome) continue;

    if (!best) {
      best = { price: outcome.price, bookmaker: bm.title };
    } else {
      // Higher american odds = better payout
      const currentDecimal = americanToDecimal(outcome.price);
      const bestDecimal = americanToDecimal(best.price);
      if (currentDecimal > bestDecimal) {
        best = { price: outcome.price, bookmaker: bm.title };
      }
    }
  }

  return best;
}

export function computeConfidence(
  game: OddsGame,
  team: string,
  sentiment: SentimentData | null
): number {
  const bestOdds = getBestOdds(game, team);
  if (!bestOdds) return 0;

  const impliedProb = americanToImpliedProb(bestOdds.price);

  // Start from implied probability as base
  let confidence = impliedProb * 100;

  // Adjust for sentiment (+/- 10 points)
  if (sentiment) {
    const isTeam1 = team === game.home_team;
    const sentimentBonus = isTeam1
      ? sentiment.score * 10
      : -sentiment.score * 10;
    confidence += sentimentBonus;
  }

  // Favor underdogs slightly when community bullish on them (value angle)
  if (bestOdds.price > 0 && sentiment?.bullishTeam === team) {
    confidence += 5;
  }

  return Math.max(5, Math.min(95, Math.round(confidence)));
}

export function generatePicks(
  games: OddsGame[],
  sentimentMap: Map<string, SentimentData>
): Pick[] {
  const picks: Pick[] = [];

  for (const game of games) {
    const teams = [game.home_team, game.away_team];

    for (const team of teams) {
      const best = getBestOdds(game, team);
      if (!best) continue;

      const sentiment = sentimentMap.get(game.id) || null;
      const confidence = computeConfidence(game, team, sentiment);

      const isUnderdog = best.price > 0;
      const impliedProb = americanToImpliedProb(best.price);

      let reasoning = '';
      if (confidence > 65) {
        reasoning = isUnderdog
          ? `Value play at +${best.price}. Community sentiment aligns with underdog value.`
          : `Strong favorite at ${best.price}. Implied probability of ${(impliedProb * 100).toFixed(0)}% supported by market consensus.`;
        if (sentiment?.bullishTeam === team) {
          reasoning += ` Reddit/forum sentiment bullish on ${team.split(' ').pop()} (${sentiment.posts} posts analyzed).`;
        }
      } else {
        reasoning = `Moderate confidence pick. Line suggests ${(impliedProb * 100).toFixed(0)}% implied probability.`;
      }

      picks.push({
        game: `${game.away_team} @ ${game.home_team}`,
        team,
        sport: game.sport_title,
        odds: best.price,
        bookmaker: best.bookmaker,
        confidence,
        reasoning,
        commenceTime: game.commence_time,
        sentiment: sentiment || undefined,
      });
    }
  }

  // Return top pick per game (highest confidence), sorted by confidence desc
  const seenGames = new Set<string>();
  return picks
    .sort((a, b) => b.confidence - a.confidence)
    .filter((p) => {
      if (seenGames.has(p.game)) return false;
      seenGames.add(p.game);
      return true;
    });
}

export function computeOddsDiscrepancies(games: OddsGame[]): OddsDiscrepancy[] {
  const discrepancies: OddsDiscrepancy[] = [];

  for (const game of games) {
    const teams = [game.home_team, game.away_team];

    for (const team of teams) {
      const allOdds: { price: number; bookmaker: string }[] = [];

      for (const bm of game.bookmakers) {
        const market = bm.markets.find((m) => m.key === 'h2h');
        if (!market) continue;
        const outcome = market.outcomes.find((o) => o.name === team);
        if (outcome) allOdds.push({ price: outcome.price, bookmaker: bm.title });
      }

      if (allOdds.length < 2) continue;

      const sorted = allOdds.sort(
        (a, b) => americanToDecimal(b.price) - americanToDecimal(a.price)
      );

      const best = sorted[0];
      const worst = sorted[sorted.length - 1];

      const bestDecimal = americanToDecimal(best.price);
      const worstDecimal = americanToDecimal(worst.price);
      const discrepancyPct = ((bestDecimal - worstDecimal) / worstDecimal) * 100;

      if (discrepancyPct < 1) continue; // Skip tiny differences

      const impliedProbBest = decimalToImpliedProb(bestDecimal) * 100;
      const impliedProbWorst = decimalToImpliedProb(worstDecimal) * 100;
      const edge = impliedProbWorst - impliedProbBest; // How much edge the best book gives

      discrepancies.push({
        game: `${game.away_team} @ ${game.home_team}`,
        team,
        sport: game.sport_title,
        commenceTime: game.commence_time,
        bestOdds: best.price,
        worstOdds: worst.price,
        bestBook: best.bookmaker,
        worstBook: worst.bookmaker,
        discrepancyPct,
        impliedProbBest,
        impliedProbWorst,
        edge,
      });
    }
  }

  return discrepancies.sort((a, b) => b.edge - a.edge);
}

export function computeParlayOdds(odds: number[]): number {
  const decimal = odds.reduce((acc, o) => acc * americanToDecimal(o), 1);
  if (decimal >= 2) return Math.round((decimal - 1) * 100);
  return Math.round(-100 / (decimal - 1));
}
