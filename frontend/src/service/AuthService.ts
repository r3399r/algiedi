import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import variableEndpoint from 'src/api/variableEndpoint';
import { RegistrationForm } from 'src/model/Form';
import { reset as apiReset } from 'src/redux/apiSlice';
import { reset as meReset, setMe } from 'src/redux/meSlice';

import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, setIsLogin, setLoadingProfile, startWaiting } from 'src/redux/uiSlice';
import { setVariable, VariableState } from 'src/redux/variableSlice';
import { sleep } from 'src/util/sleep';

const getUserPoolVariable = async (): Promise<VariableState> => {
  const state = getState().variable;
  if (state.userPoolClientId === undefined || state.userPoolId === undefined) {
    const res = await variableEndpoint.getVariables({ name: 'USER_POOL_ID,USER_POOL_CLIENT_ID' });
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

const getCurrentUser = async () => {
  try {
    const userPool = await getUserPool();
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser === null) throw new Error('no user found');

    await new Promise((resolve, reject) => {
      cognitoUser.getSession((err: unknown, session: CognitoUserSession) => {
        if (err) reject(err);
        else resolve(session);
      });
    });

    return cognitoUser;
  } catch (err) {
    localStorage.removeItem('token');
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
  try {
    dispatch(startWaiting());
    const result = await authenticateUser(email, password);
    localStorage.setItem('token', result.getIdToken().getJwtToken());
    dispatch(setIsLogin(true));
    await sleep(100);
    const attributes = await getUserAttributes();

    return attributes.find((v) => v.name === 'custom:questionnaire_filled')?.value;
  } catch (err) {
    throw (err as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};

export const register = async (data: RegistrationForm) => {
  try {
    dispatch(startWaiting());
    const userPool = await getUserPool();

    const userName = new CognitoUserAttribute({
      Name: 'custom:user_name',
      Value: data.userName,
    });

    await new Promise((resolve, reject) => {
      userPool.signUp(data.email, data.password, [userName], [], (err, result) => {
        if (err || result === undefined) reject(err);
        else resolve(result.user);
      });
    });
  } catch (err) {
    throw (err as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};

export const resendConfirmationEmail = async (email: string) => {
  try {
    dispatch(startWaiting());
    const cognitoUser = await getCognitoUser(email);

    await new Promise((resolve, reject) => {
      cognitoUser.resendConfirmationCode((err) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });
  } catch (err) {
    throw (err as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};

export const verifyAccount = async (email: string, code: string) => {
  try {
    dispatch(startWaiting());
    const cognitoUser = await getCognitoUser(email);

    await new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (err) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });
  } catch (err) {
    throw (err as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getUserAttributes = async () => {
  const cognitoUser = await getCurrentUser();
  const userAttributes: CognitoUserAttribute[] | undefined = await new Promise(
    (resolve, reject) => {
      cognitoUser.getUserAttributes((err, res: CognitoUserAttribute[] | undefined) => {
        if (err) reject(err);
        else resolve(res);
      });
    },
  );

  return (userAttributes ?? []).map((v) => ({ name: v.Name, value: v.Value }));
};

export const loadUserAttributes = async () => {
  const isLoadingProfile = getState().ui.isLoadingProfile;
  if (isLoadingProfile === true) return;

  dispatch(setLoadingProfile(true));

  const userAttributes = await getUserAttributes();
  const res: { [key: string]: string } = {};
  userAttributes.forEach((v) => {
    res[v.name] = v.value;
  });

  dispatch(
    setMe({
      sub: res.sub,
      userName: res['custom:user_name'],
      bio: res['custom:bio'],
      emailVerified: Boolean(res.email_verified),
      language: res['custom:language']?.split(',') ?? [],
      role: res['custom:role']?.split(',') ?? [],
      email: res.email,
      age: res['custom:age'],
      tag: res['custom:tag']?.split(',') ?? [],
      facebook: res['custom:facebook'],
      instagram: res['custom:instagram'],
      youtube: res['custom:youtube'],
      soundcloud: res['custom:soundcloud'],
      lastProjectId: res['custom:last_project_id'],
    }),
  );

  dispatch(setLoadingProfile(false));
};

export const updateUserAttributes = async (data: {
  role: string;
  language: string;
  instrument: string;
  favoriate: string;
}) => {
  try {
    dispatch(startWaiting());
    const role = new CognitoUserAttribute({ Name: 'custom:role', Value: data.role });
    const language = new CognitoUserAttribute({ Name: 'custom:language', Value: data.language });
    const bio = new CognitoUserAttribute({
      Name: 'custom:bio',
      Value: `I am good at playing the ${data.instrument}.`,
    });
    const tag = new CognitoUserAttribute({
      Name: 'custom:tag',
      Value: data.favoriate,
    });
    const questionnaireFilled = new CognitoUserAttribute({
      Name: 'custom:questionnaire_filled',
      Value: 'true',
    });

    await updateCognitoAttributes([role, language, bio, tag, questionnaireFilled]);
  } finally {
    dispatch(finishWaiting());
  }
};

export const sendForgot = async (email: string) => {
  try {
    dispatch(startWaiting());
    const cognitoUser = await getCognitoUser(email);

    await new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: (data) => resolve(data),
        onFailure: (err) => reject(err),
      });
    });
  } finally {
    dispatch(finishWaiting());
  }
};

export const confirmForgot = async (email: string, newPassword: string, code: string) => {
  try {
    dispatch(startWaiting());
    const cognitoUser = await getCognitoUser(email);

    await new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: () => resolve(undefined),
        onFailure: (err) => reject(err),
      });
    });
  } catch (err) {
    throw (err as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};

export const logout = async () => {
  try {
    dispatch(startWaiting());
    const cognitoUser = await getCurrentUser();
    cognitoUser.signOut();
    localStorage.removeItem('token');
    dispatch(setIsLogin(false));
    dispatch(apiReset());
    dispatch(meReset());
  } finally {
    dispatch(finishWaiting());
  }
};
