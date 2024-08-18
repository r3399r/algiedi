import { useMemo } from 'react';
import { randomBase58 } from 'src/util/random';

const useLoginEndpoint = () => {
  const googleOauthEndpoint = useMemo(() => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const state = randomBase58(10);
    sessionStorage.setItem('login-google-state', state);
    const options = {
      client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID as string,
      redirect_uri: `${window.location.origin}/auth/callback`,
      response_type: 'code',
      scope:
        'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      state,
    };

    const qs = new URLSearchParams(options);

    return `${rootUrl}?${qs.toString()}`;
  }, []);

  return { google: googleOauthEndpoint };
};

export default useLoginEndpoint;
