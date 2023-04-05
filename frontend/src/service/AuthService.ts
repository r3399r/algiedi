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
import { finishWaiting, setIsLogin, startWaiting } from 'src/redux/uiSlice';
import { setVariable, VariableState } from 'src/redux/variableSlice';

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

export const getCurrentUser = async () => {
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
  } finally {
    dispatch(finishWaiting());
  }
};

export const register = async (data: RegistrationForm) => {
  try {
    dispatch(startWaiting());
    const userPool = await getUserPool();

    const firstName = new CognitoUserAttribute({
      Name: 'custom:first_name',
      Value: data.firstName,
    });
    const lastName = new CognitoUserAttribute({ Name: 'custom:last_name', Value: data.lastName });

    await new Promise((resolve, reject) => {
      userPool.signUp(data.email, data.password, [firstName, lastName], [], (err, result) => {
        if (err || result === undefined) reject(err);
        else resolve(result.user);
      });
    });
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
  } finally {
    dispatch(finishWaiting());
  }
};

export const verify = async (email: string, password: string, code: string) => {
  try {
    dispatch(startWaiting());
    const cognitoUser = await getCognitoUser(email);

    await new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (err) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

    const result = await authenticateUser(email, password);
    localStorage.setItem('token', result.getIdToken().getJwtToken());
    dispatch(setIsLogin(true));
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
      Value: `I love ${data.favoriate}. I play the ${data.instrument}.`,
    });

    const cognitoUser = await getCurrentUser();
    await new Promise((resolve, reject) => {
      cognitoUser.updateAttributes([role, language, bio], (err) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });
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
  } finally {
    dispatch(finishWaiting());
  }
};
