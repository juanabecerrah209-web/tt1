export interface OddsGame {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

export interface Bookmaker {
  key: string;
  title: string;
  markets: Market[];
}

export interface Market {
  key: string;
  outcomes: Outcome[];
}

export interface Outcome {
  name: string;
  price: number;
}

export interface RedditPost {
  title: string;
  score: number;
  url: string;
  subreddit: string;
  selftext: string;
  created_utc: number;
}

export interface Pick {
  game: string;
  team: string;
  sport: string;
  odds: number;
  bookmaker: string;
  confidence: number;
  reasoning: string;
  commenceTime: string;
  sentiment?: SentimentData;
}

export interface SentimentData {
  score: number; // -1 to 1
  posts: number;
  bullishTeam: string;
  topPost: string;
}

export interface ParlayLeg {
  pick: Pick;
  selected: boolean;
}

export interface OddsDiscrepancy {
  game: string;
  team: string;
  sport: string;
  commenceTime: string;
  bestOdds: number;
  worstOdds: number;
  bestBook: string;
  worstBook: string;
  discrepancyPct: number;
  impliedProbBest: number;
  impliedProbWorst: number;
  edge: number;
}
