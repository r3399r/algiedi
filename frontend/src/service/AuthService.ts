import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import userEndpoint from 'src/api/userEndpoint';
import { PatchUserRequest } from 'src/model/backend/api/User';
import { RegistrationForm } from 'src/model/Form';
import { reset as apiReset } from 'src/redux/apiSlice';
import { reset as meReset, setMe } from 'src/redux/meSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, setIsLogin, setLoadingProfile, startWaiting } from 'src/redux/uiSlice';
import {
  authenticateUser,
  confirmPassword,
  confirmRegistration,
  forgotPassword,
  getCurrentUser,
  resendConfirmationCode,
  signUp,
} from 'src/util/cognito';
import { sleep } from 'src/util/sleep';

export const login = async (email: string, password: string) => {
  try {
    dispatch(startWaiting());
    const result = await authenticateUser(email, password);
    localStorage.setItem('token', result.getIdToken().getJwtToken());
    localStorage.setItem('expiration', result.getIdToken().getExpiration().toString());
    dispatch(setIsLogin(true));
    await sleep(100);
    const attributes = await getUserAttributes();

    return attributes.find((v) => v.name === 'custom:status')?.value;
  } catch (e) {
    throw (e as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};

export const register = async (data: RegistrationForm) => {
  try {
    dispatch(startWaiting());

    const userName = new CognitoUserAttribute({
      Name: 'custom:user_name',
      Value: data.userName,
    });

    await signUp(data.email, data.password, [userName]);
  } catch (e) {
    throw (e as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};

export const resendConfirmationEmail = async (email: string) => {
  try {
    dispatch(startWaiting());

    await resendConfirmationCode(email);
  } catch (e) {
    throw (e as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};

export const verifyAccount = async (email: string, code: string) => {
  try {
    dispatch(startWaiting());

    await confirmRegistration(email, code);
  } catch (e) {
    throw (e as Error).message;
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

export const saveQuestionnaire = async (data: PatchUserRequest) => {
  try {
    dispatch(startWaiting());

    await userEndpoint.patchUser(data);
  } catch (e) {
    throw (e as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};

export const sendForgot = async (email: string) => {
  try {
    dispatch(startWaiting());

    await forgotPassword(email);
  } catch (e) {
    throw (e as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};

export const confirmForgot = async (email: string, newPassword: string, code: string) => {
  try {
    dispatch(startWaiting());

    await confirmPassword(email, newPassword, code);
  } catch (e) {
    throw (e as Error).message;
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
    localStorage.removeItem('expiration');
    dispatch(setIsLogin(false));
    dispatch(apiReset());
    dispatch(meReset());
  } catch (e) {
    throw (e as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};
