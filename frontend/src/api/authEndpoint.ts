import {
  PostAuthForgotConfirmRequest,
  PostAuthForgotSendRequest,
  PostAuthLoginRequest,
  PostAuthLoginResponse,
  PostAuthSignupConfirmRequest,
  PostAuthSignupRequest,
  PostAuthSignupResendRequest,
} from 'src/model/backend/api/Auth';
import http from 'src/util/http';

const postAuthLogin = async (data: PostAuthLoginRequest) =>
  await http.post<PostAuthLoginResponse, PostAuthLoginRequest>('auth/login', { data });

const postAuthSignup = async (data: PostAuthSignupRequest) =>
  await http.post('auth/signup', { data });

const postAuthSignupResend = async (data: PostAuthSignupResendRequest) =>
  await http.post('auth/signup/resend', { data });

const postAuthSignupConfirm = async (data: PostAuthSignupConfirmRequest) =>
  await http.post('auth/signup/confirm', { data });

const postAuthForgotSend = async (data: PostAuthForgotSendRequest) =>
  await http.post('auth/forgot/send', { data });

const postAuthForgotConfirm = async (data: PostAuthForgotConfirmRequest) =>
  await http.post('auth/forgot/confirm', { data });

export default {
  postAuthLogin,
  postAuthSignup,
  postAuthSignupResend,
  postAuthSignupConfirm,
  postAuthForgotSend,
  postAuthForgotConfirm,
};
