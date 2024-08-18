export type PostAuthLoginRequest = {
  platform: 'google';
  code: string;
  redirectUrl: string;
};

export type PostAuthLoginResponse = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  idToken: string;
};
