import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import variableEndpoint from 'src/api/variableEndpoint';
import { RegistrationForm } from 'src/model/Form';
import { dispatch, getState } from 'src/redux/store';
import { setVariable, VariableState } from 'src/redux/variableSlice';

const getUserPoolVariable = async (): Promise<VariableState> => {
  const state = getState().variable;
  if (state.userPoolClientId === undefined || state.userPoolId === undefined) {
    const res = await variableEndpoint.getVariable({ name: 'USER_POOL_ID,USER_POOL_CLIENT_ID' });
    const variable = {
      userPoolClientId: res.data.USER_POOL_CLIENT_ID,
      userPoolId: res.data.USER_POOL_ID,
    };
    dispatch(setVariable(variable));

    return variable;
  }

  return state;
};

const getUserPool = async () => {
  const { userPoolClientId, userPoolId } = await getUserPoolVariable();

  return new CognitoUserPool({
    UserPoolId: userPoolId ?? '',
    ClientId: userPoolClientId ?? '',
  });
};

const getCognitoUser = async (email: string) => {
  const userPool = await getUserPool();

  return new CognitoUser({
    Username: email,
    Pool: userPool,
  });
};

const authenticateUser = async (email: string, password: string): Promise<CognitoUserSession> => {
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

export const login = async (email: string, password: string) => {
  const result = await authenticateUser(email, password);
  localStorage.setItem('token', result.getIdToken().getJwtToken());
};

export const register = async (data: RegistrationForm) => {
  const userPool = await getUserPool();

  const firstName = new CognitoUserAttribute({ Name: 'custom:first_name', Value: data.firstName });
  const lastName = new CognitoUserAttribute({ Name: 'custom:last_name', Value: data.lastName });

  await new Promise((resolve, reject) => {
    userPool.signUp(data.email, data.password, [firstName, lastName], [], (err, result) => {
      if (err || result === undefined) reject(err);
      else resolve(result.user);
    });
  });
};

export const resendVerificationEmail = async (email: string) => {
  const cognitoUser = await getCognitoUser(email);

  await new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode((err) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
};

export const verify = async (email: string, password: string, code: string) => {
  const cognitoUser = await getCognitoUser(email);

  await new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });

  await authenticateUser(email, password);
};

export const updateUserAttributes = async (
  email: string,
  data: { role: string; language: string; instrument: string; favoriate: string },
) => {
  const role = new CognitoUserAttribute({ Name: 'custom:role', Value: data.role });
  const language = new CognitoUserAttribute({ Name: 'custom:language', Value: data.language });
  const bio = new CognitoUserAttribute({
    Name: 'custom:bio',
    Value: `I love ${data.favoriate}. I play the ${data.instrument}.`,
  });

  const pool = await getUserPool();
  const cognitoUser = pool.getCurrentUser();
  if (cognitoUser === null) throw new Error('no user found');

  await new Promise((resolve, reject) => {
    cognitoUser.getSession((err: any, session: CognitoUserSession) => {
      if (err) reject(err);
      else resolve(session);
    });
  });
  await new Promise((resolve, reject) => {
    cognitoUser.updateAttributes([role, language, bio], (err) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
};

export const sendForgot = async (email: string) => {
  const cognitoUser = await getCognitoUser(email);

  await new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: (data) => resolve(data),
      onFailure: (err) => reject(err),
    });
  });
};

export const confirmForgot = async (email: string, newPassword: string, code: string) => {
  const cognitoUser = await getCognitoUser(email);

  await new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(undefined),
      onFailure: (err) => reject(err),
    });
  });
};
