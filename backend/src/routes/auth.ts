import { bindings } from 'src/bindings';
import { AuthService } from 'src/logic/AuthService';
import {
  PostAuthForgotConfirmRequest,
  PostAuthForgotSendRequest,
  PostAuthLoginRequest,
  PostAuthRefreshTokenRequest,
  PostAuthSignupConfirmRequest,
  PostAuthSignupRequest,
  PostAuthSignupResendRequest,
} from 'src/model/api/Auth';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: AuthService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(AuthService);

  switch (event.resource) {
    case '/api/auth/login':
      return await authLogin();
    case '/api/auth/refresh':
      return await authRefresh();
    case '/api/auth/signup':
      return await authSignup();
    case '/api/auth/signup/resend':
      return await authSignupResend();
    case '/api/auth/signup/confirm':
      return await authSignupConfirm();
    case '/api/auth/forgot/send':
      return await authForgotSend();
    case '/api/auth/forgot/confirm':
      return await authForgotConfirm();
  }

  throw new BadRequestError('unexpected resource');
};

const authLogin = async () => {
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.login(
        JSON.parse(event.body) as PostAuthLoginRequest
      );
  }

  throw new Error('unexpected httpMethod');
};

const authRefresh = async () => {
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.refreshToken(
        JSON.parse(event.body) as PostAuthRefreshTokenRequest
      );
  }

  throw new Error('unexpected httpMethod');
};

const authSignup = async () => {
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.signup(
        JSON.parse(event.body) as PostAuthSignupRequest
      );
  }

  throw new Error('unexpected httpMethod');
};

const authSignupResend = async () => {
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.resend(
        JSON.parse(event.body) as PostAuthSignupResendRequest
      );
  }

  throw new Error('unexpected httpMethod');
};

const authSignupConfirm = async () => {
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.confirmSignup(
        JSON.parse(event.body) as PostAuthSignupConfirmRequest
      );
  }

  throw new Error('unexpected httpMethod');
};

const authForgotSend = async () => {
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.forgotSend(
        JSON.parse(event.body) as PostAuthForgotSendRequest
      );
  }

  throw new Error('unexpected httpMethod');
};

const authForgotConfirm = async () => {
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.forgotConfirm(
        JSON.parse(event.body) as PostAuthForgotConfirmRequest
      );
  }

  throw new Error('unexpected httpMethod');
};
