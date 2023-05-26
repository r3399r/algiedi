import { CognitoMessageEvent, LambdaContext } from 'src/model/Lambda';

export async function cognitoMessage(
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
