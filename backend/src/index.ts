import {
  CognitoMessageEvent,
  CognitoSignupEvent,
  LambdaContext,
  LambdaEvent,
  WsEvent,
} from 'src/model/Lambda';
import { DbAccess } from './access/DbAccess';
import { bindings } from './bindings';
import { CognitoService } from './logic/CognitoService';
import { WsService } from './logic/WsService';
import { WebsocketMessage } from './model/api/Ws';
import creation from './routes/creation';
import explore from './routes/explore';
import me from './routes/me';
import notification from './routes/notification';
import project from './routes/project';
import sns from './routes/sns';
import upload from './routes/upload';
import user from './routes/user';
import { errorOutput, successOutput } from './util/lambdaHelper';
import { LambdaSetup } from './util/LambdaSetup';

export const api = async (event: LambdaEvent, _context?: LambdaContext) => {
  console.log(event);
  const db = bindings.get(DbAccess);
  await db.startTransaction();
  LambdaSetup.setup(event);
  try {
    let res: any;

    const resource = event.resource.split('/')[2];
    switch (resource) {
      case 'me':
        res = await me(event);
        break;
      case 'creation':
        res = await creation(event);
        break;
      case 'explore':
        res = await explore(event);
        break;
      case 'project':
        res = await project(event);
        break;
      case 'sns':
        res = await sns(event);
        break;
      case 'upload':
        res = await upload(event);
        break;
      case 'user':
        res = await user(event);
        break;
      case 'notification':
        res = await notification(event);
        break;
    }

    const output = successOutput(res);
    await db.commitTransaction();

    return output;
  } catch (e) {
    console.log(e);
    await db.rollbackTransaction();

    return errorOutput(e);
  } finally {
    await db.cleanup();
  }
};

export async function ws(
  event: WsEvent,
  _context?: LambdaContext
): Promise<any> {
  console.log(event);
  let service: WsService | null = null;
  try {
    service = bindings.get(WsService);
    const routeKey = event.requestContext.routeKey as string;
    const connectionId = event.requestContext.connectionId as string;
    const userId = event.queryStringParameters?.userId as string;

    let res: WebsocketMessage;

    switch (routeKey) {
      case '$connect':
        res = await service.receiveConnect(userId, connectionId);
        break;
      case '$disconnect':
        res = await service.receiveDisconnect(connectionId);
        break;
      case '$default':
        res = await service.receiveDefault();
        break;
      case 'chat':
        res = await service.receiveChat(JSON.parse(event.body));
        break;
      default:
        throw new Error(`Unknown routeKey: ${routeKey}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch (e) {
    console.log(e);

    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  } finally {
    await service?.cleanup();
  }
}

export async function message(
  event: CognitoMessageEvent,
  _context?: LambdaContext
): Promise<CognitoMessageEvent> {
  console.log(event);
  const baseUrl =
    process.env.ENVR === 'prod'
      ? `https://www.${process.env.DOMAIN}`
      : `https://${process.env.ENVR}.${process.env.DOMAIN}`;
  if (
    event.triggerSource === 'CustomMessage_SignUp' ||
    event.triggerSource === 'CustomMessage_ResendCode'
  ) {
    const url = `${baseUrl}/auth/verify?email=${encodeURIComponent(
      event.request.userAttributes.email
    )}&code=${event.request.codeParameter}`;
    const message = `<div>Please click <a href="${url}">here<a> to verify.`;
    event.response.smsMessage = message;
    event.response.emailMessage = message;
    event.response.emailSubject = 'GoTron Music Verification';
  } else if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    const url = `${baseUrl}/auth/forget/reset?email=${encodeURIComponent(
      event.request.userAttributes.email
    )}&code=${event.request.codeParameter}`;
    const message = `<div>Please click <a href="${url}">here<a> to reset password.`;
    event.response.smsMessage = message;
    event.response.emailMessage = message;
    event.response.emailSubject = 'GoTron Music Reset Password';
  }

  return event;
}

export async function signup(
  event: CognitoSignupEvent,
  _context?: LambdaContext
): Promise<CognitoSignupEvent> {
  console.log(event);
  let service: CognitoService | null = null;
  try {
    service = bindings.get(CognitoService);
    if (event.triggerSource === 'PreSignUp_SignUp')
      await service.addUser(
        event.userName,
        event.request.userAttributes.email,
        event.request.userAttributes['custom:user_name']
      );

    return event;
  } finally {
    await service?.cleanup();
  }
}
