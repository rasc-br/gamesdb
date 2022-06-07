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
