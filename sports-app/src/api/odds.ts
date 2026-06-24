import axios from 'axios';
import type { OddsGame } from '../types';

// The Odds API - free tier: 500 requests/month
// Users should set VITE_ODDS_API_KEY in .env
const API_KEY = import.meta.env.VITE_ODDS_API_KEY || 'demo';
const BASE = 'https://api.the-odds-api.com/v4';

// Supported sports to scan
const SPORTS = [
  'americanfootball_nfl',
  'basketball_nba',
  'baseball_mlb',
  'icehockey_nhl',
  'soccer_usa_mls',
];

export async function fetchLiveOdds(): Promise<OddsGame[]> {
  if (API_KEY === 'demo') {
    return getMockOdds();
  }

  const results: OddsGame[] = [];
  for (const sport of SPORTS) {
    try {
      const res = await axios.get<OddsGame[]>(`${BASE}/sports/${sport}/odds`, {
        params: {
          apiKey: API_KEY,
          regions: 'us',
          markets: 'h2h',
          oddsFormat: 'american',
        },
      });
      results.push(...res.data);
    } catch {
      // skip failed sport
    }
  }
  return results;
}

function getMockOdds(): OddsGame[] {
  return [
    {
      id: '1',
      sport_key: 'basketball_nba',
      sport_title: 'NBA',
      commence_time: new Date(Date.now() + 3 * 3600000).toISOString(),
      home_team: 'Boston Celtics',
      away_team: 'Miami Heat',
      bookmakers: [
        {
          key: 'fanduel', title: 'FanDuel',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Boston Celtics', price: -150 }, { name: 'Miami Heat', price: +130 }] }],
        },
        {
          key: 'draftkings', title: 'DraftKings',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Boston Celtics', price: -160 }, { name: 'Miami Heat', price: +140 }] }],
        },
        {
          key: 'betmgm', title: 'BetMGM',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Boston Celtics', price: -145 }, { name: 'Miami Heat', price: +125 }] }],
        },
        {
          key: 'caesars', title: 'Caesars',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Boston Celtics', price: -155 }, { name: 'Miami Heat', price: +135 }] }],
        },
      ],
    },
    {
      id: '2',
      sport_key: 'baseball_mlb',
      sport_title: 'MLB',
      commence_time: new Date(Date.now() + 5 * 3600000).toISOString(),
      home_team: 'New York Yankees',
      away_team: 'Los Angeles Dodgers',
      bookmakers: [
        {
          key: 'fanduel', title: 'FanDuel',
          markets: [{ key: 'h2h', outcomes: [{ name: 'New York Yankees', price: +110 }, { name: 'Los Angeles Dodgers', price: -130 }] }],
        },
        {
          key: 'draftkings', title: 'DraftKings',
          markets: [{ key: 'h2h', outcomes: [{ name: 'New York Yankees', price: +115 }, { name: 'Los Angeles Dodgers', price: -135 }] }],
        },
        {
          key: 'betmgm', title: 'BetMGM',
          markets: [{ key: 'h2h', outcomes: [{ name: 'New York Yankees', price: +105 }, { name: 'Los Angeles Dodgers', price: -125 }] }],
        },
        {
          key: 'pointsbet', title: 'PointsBet',
          markets: [{ key: 'h2h', outcomes: [{ name: 'New York Yankees', price: +125 }, { name: 'Los Angeles Dodgers', price: -145 }] }],
        },
      ],
    },
    {
      id: '3',
      sport_key: 'americanfootball_nfl',
      sport_title: 'NFL',
      commence_time: new Date(Date.now() + 20 * 3600000).toISOString(),
      home_team: 'Kansas City Chiefs',
      away_team: 'Buffalo Bills',
      bookmakers: [
        {
          key: 'fanduel', title: 'FanDuel',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Kansas City Chiefs', price: -175 }, { name: 'Buffalo Bills', price: +150 }] }],
        },
        {
          key: 'draftkings', title: 'DraftKings',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Kansas City Chiefs', price: -180 }, { name: 'Buffalo Bills', price: +155 }] }],
        },
        {
          key: 'betmgm', title: 'BetMGM',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Kansas City Chiefs', price: -170 }, { name: 'Buffalo Bills', price: +145 }] }],
        },
        {
          key: 'caesars', title: 'Caesars',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Kansas City Chiefs', price: -185 }, { name: 'Buffalo Bills', price: +160 }] }],
        },
      ],
    },
    {
      id: '4',
      sport_key: 'icehockey_nhl',
      sport_title: 'NHL',
      commence_time: new Date(Date.now() + 4 * 3600000).toISOString(),
      home_team: 'Toronto Maple Leafs',
      away_team: 'Montreal Canadiens',
      bookmakers: [
        {
          key: 'fanduel', title: 'FanDuel',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Toronto Maple Leafs', price: -140 }, { name: 'Montreal Canadiens', price: +120 }] }],
        },
        {
          key: 'draftkings', title: 'DraftKings',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Toronto Maple Leafs', price: -135 }, { name: 'Montreal Canadiens', price: +115 }] }],
        },
        {
          key: 'betmgm', title: 'BetMGM',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Toronto Maple Leafs', price: -145 }, { name: 'Montreal Canadiens', price: +125 }] }],
        },
      ],
    },
    {
      id: '5',
      sport_key: 'basketball_nba',
      sport_title: 'NBA',
      commence_time: new Date(Date.now() + 6 * 3600000).toISOString(),
      home_team: 'Golden State Warriors',
      away_team: 'Los Angeles Lakers',
      bookmakers: [
        {
          key: 'fanduel', title: 'FanDuel',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Golden State Warriors', price: +105 }, { name: 'Los Angeles Lakers', price: -125 }] }],
        },
        {
          key: 'draftkings', title: 'DraftKings',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Golden State Warriors', price: +110 }, { name: 'Los Angeles Lakers', price: -130 }] }],
        },
        {
          key: 'betmgm', title: 'BetMGM',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Golden State Warriors', price: +100 }, { name: 'Los Angeles Lakers', price: -120 }] }],
        },
        {
          key: 'caesars', title: 'Caesars',
          markets: [{ key: 'h2h', outcomes: [{ name: 'Golden State Warriors', price: +115 }, { name: 'Los Angeles Lakers', price: -135 }] }],
        },
      ],
    },
  ];
}
