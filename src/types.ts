export interface UserToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  expires_at: number;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export type ConsoleName = 'main' | 'atari2600' | 'msx' | 'amiga';
export type OffsetType = 'spotlight' | 'search';
export type CurrentView = 'singleGame' | 'search';

export interface ConsoleInfo {
  name: ConsoleName;
  mainColor: string;
  igdbId: number;
}

export interface Game {
  id: number;
  name?: string;
  cover: GameCover;
  screenshots?: Screenshots[];
  storyline?: string;
  summary?: string;
  videos?: string;
  total_rating?: number;
}

export interface GameCover {
  id: number;
  url: string;
}

export type Pagination = {
  [key in ConsoleName]: {
    spotlight: number;
    search: number;
  };
};

export type GamesGroup = {
  [key in ConsoleName]: Game[];
};

export type Screenshots = {
  id: number;
  game: number;
  height: number;
  url: string;
  width: number;
}