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
