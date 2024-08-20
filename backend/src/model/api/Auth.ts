type GoogleLoginRequest = {
  platform: 'google';
  code: string;
  redirectUrl: string;
};

type CognitoLoginRequest = {
  platform: 'cognito';
  email: string;
  password: string;
};

export type PostAuthLoginRequest = GoogleLoginRequest | CognitoLoginRequest;

export type PostAuthLoginResponse = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  idToken: string;
  questionnaireFilled: boolean;
};

export type PostAuthRefreshTokenRequest = {
  refreshToken: string;
};

export type PostAuthRefreshTokenResponse = {
  accessToken: string;
  expiresIn: number;
  idToken: string;
};

export type PostAuthSignupRequest = {
  email: string;
  password: string;
  username: string;
};

export type PostAuthSignupResendRequest = {
  username: string;
};

export type PostAuthSignupConfirmRequest = {
  username: string;
  code: string;
};

export type PostAuthForgotSendRequest = {
  username: string;
};

export type PostAuthForgotConfirmRequest = {
  username: string;
  password: string;
  code: string;
};
