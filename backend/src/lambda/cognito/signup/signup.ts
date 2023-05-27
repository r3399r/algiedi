import { bindings } from 'src/bindings';
import { CognitoService } from 'src/logic/CognitoService';
import { CognitoSignupEvent, LambdaContext } from 'src/model/Lambda';

export async function signup(
  event: CognitoSignupEvent,
  _context?: LambdaContext
): Promise<CognitoSignupEvent> {
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
