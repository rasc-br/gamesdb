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

export interface ConsoleInfo {
  name: 'main' | 'atari2600' | 'msx' | 'amiga';
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
