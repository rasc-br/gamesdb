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

export interface ConsoleInfo {
  name: ConsoleName;
  mainColor: string;
  igdbId: number;
}

export interface Game {
  id: number;
  cover: GameCover;
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
