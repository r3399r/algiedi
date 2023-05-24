import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

export const getUserPool = async () =>
  new CognitoUserPool({
    UserPoolId: process.env.REACT_APP_USER_POOL_ID ?? '',
    ClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID ?? '',
  });

export const getCognitoUser = async (email: string) => {
  const userPool = await getUserPool();

  return new CognitoUser({
    Username: email,
    Pool: userPool,
  });
};

export const getCognitoUserSession = async (
  cognitoUser: CognitoUser,
): Promise<CognitoUserSession> =>
  await new Promise((resolve, reject) => {
    cognitoUser.getSession((err: unknown, session: CognitoUserSession) => {
      if (err) reject(err);
      else resolve(session);
    });
  });

export const getCurrentUser = async () => {
  try {
    const userPool = await getUserPool();
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser === null) throw new Error('no user found');

    await getCognitoUserSession(cognitoUser);

    return cognitoUser;
  } catch (err) {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    throw err;
  }
};

export const updateCognitoAttributes = async (cognitoUserAttributes: CognitoUserAttribute[]) => {
  const cognitoUser = await getCurrentUser();
  await new Promise((resolve, reject) => {
    cognitoUser.updateAttributes(cognitoUserAttributes, (err) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
};

export const authenticateUser = async (
  email: string,
  password: string,
): Promise<CognitoUserSession> => {
  const cognitoUser = await getCognitoUser(email);
  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  return await new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (r) => resolve(r),
      onFailure: (e) => reject(e),
    });
  });
};

export const refreshUserSession = async (): Promise<CognitoUserSession> => {
  const cognitoUser = await getCurrentUser();
  const userSession = await getCognitoUserSession(cognitoUser);
  const refreshToken = userSession.getRefreshToken();

  return await new Promise((resolve, reject) => {
    cognitoUser.refreshSession(refreshToken, (err, session) => {
      if (err) reject(err);
      else resolve(session);
    });
  });
};
