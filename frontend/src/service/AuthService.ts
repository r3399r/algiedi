import authEndpoint from 'src/api/authEndpoint';
import userEndpoint from 'src/api/userEndpoint';
import { PostAuthLoginResponse } from 'src/model/backend/api/Auth';
import { PatchUserRequest } from 'src/model/backend/api/User';
import { RegistrationForm } from 'src/model/Form';
import { reset as apiReset } from 'src/redux/apiSlice';
import { setIsLogin } from 'src/redux/authSlice';
import { reset as meReset } from 'src/redux/meSlice';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { sleep } from 'src/util/sleep';
import { wsStop } from 'src/util/wsTick';

const setLoginState = async (data: PostAuthLoginResponse) => {
  localStorage.setItem('token', data.idToken);
  localStorage.setItem('expiration', (Date.now() + data.expiresIn * 1000).toString());
  localStorage.setItem('refreshToken', data.refreshToken);
  dispatch(setIsLogin(true));
  await sleep(100);
};

export const loginByGoogle = async (code: string, redirectUrl: string) => {
  try {
    dispatch(startWaiting());
    const res = await authEndpoint.postAuthLogin({
      platform: 'google',
      code,
      redirectUrl,
    });
    await setLoginState(res.data);

    return res.data.questionnaireFilled;
  } finally {
    dispatch(finishWaiting());
  }
};

export const loginByCognito = async (email: string, password: string) => {
  try {
    dispatch(startWaiting());
    const res = await authEndpoint.postAuthLogin({
      platform: 'cognito',
      email,
      password,
    });
    await setLoginState(res.data);

    return res.data.questionnaireFilled;
  } finally {
    dispatch(finishWaiting());
  }
};

export const register = async (data: RegistrationForm) => {
  try {
    dispatch(startWaiting());

    await authEndpoint.postAuthSignup({
      email: data.email,
      password: data.password,
      username: data.userName,
    });
  } finally {
    dispatch(finishWaiting());
  }
};

export const resendConfirmationEmail = async (email: string) => {
  try {
    dispatch(startWaiting());

    await authEndpoint.postAuthSignupResend({ username: email });
  } finally {
    dispatch(finishWaiting());
  }
};

export const verifyAccount = async (email: string, code: string) => {
  try {
    dispatch(startWaiting());

    await authEndpoint.postAuthSignupConfirm({ username: email, code });
  } finally {
    dispatch(finishWaiting());
  }
};

export const saveQuestionnaire = async (data: PatchUserRequest) => {
  try {
    dispatch(startWaiting());

    await userEndpoint.patchUser(data);
  } finally {
    dispatch(finishWaiting());
  }
};

export const sendForgot = async (email: string) => {
  try {
    dispatch(startWaiting());

    await authEndpoint.postAuthForgotSend({ username: email });
  } finally {
    dispatch(finishWaiting());
  }
};

export const confirmForgot = async (email: string, newPassword: string, code: string) => {
  try {
    dispatch(startWaiting());

    await authEndpoint.postAuthForgotConfirm({ username: email, password: newPassword, code });
  } finally {
    dispatch(finishWaiting());
  }
};

export const logout = async () => {
  try {
    dispatch(startWaiting());
    wsStop();
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('refreshToken');
    dispatch(setIsLogin(false));
    dispatch(apiReset());
    dispatch(meReset());
  } finally {
    dispatch(finishWaiting());
  }
};
