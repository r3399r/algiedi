export type Oauth = {
  access_token: string;
  expired_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
};

export type UserInfo = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};
