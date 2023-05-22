import { bindings } from 'src/bindings';
import { CognitoService } from 'src/logic/CognitoService';
import { CognitoSignupEvent, LambdaContext } from 'src/model/Lambda';

export async function cognitoSignup(
  event: CognitoSignupEvent,
  _context?: LambdaContext
): Promise<CognitoSignupEvent> {
  let service: CognitoService | null = null;
  try {
    if (event.triggerSource === 'PreSignUp_SignUp') {
      service = bindings.get(CognitoService);
      await service.addUser(
        event.userName,
        event.request.userAttributes['custom:user_name']
      );
    }

    return event;
  } finally {
    await service?.cleanup();
  }
}
