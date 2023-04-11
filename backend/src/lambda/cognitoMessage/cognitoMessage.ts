import { CognitoMessageEvent, LambdaContext } from 'src/model/Lambda';

export async function cognitoMessage(
  event: CognitoMessageEvent,
  _context?: LambdaContext
): Promise<CognitoMessageEvent> {
  if (
    event.triggerSource === 'CustomMessage_SignUp' ||
    event.triggerSource === 'CustomMessage_ResendCode'
  ) {
    const message = `Please click the url below to verify: https://d6sxiz9z2i2n.cloudfront.net/auth/verify?email=${encodeURIComponent(
      event.request.userAttributes.email
    )}&code=${event.request.codeParameter}`;
    event.response.smsMessage = message;
    event.response.emailMessage = message;
    event.response.emailSubject = 'GoTron Music Verification';
  }

  return event;
}
