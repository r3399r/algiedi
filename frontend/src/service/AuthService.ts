import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import variableEndpoint from 'src/api/variableEndpoint';
import { dispatch, getState } from 'src/redux/store';
import { setVariable, VariableState } from 'src/redux/variableSlice';

const getUserPoolVariable = async (): Promise<VariableState> => {
  const state = getState().variable;
  if (state.userPoolClientId === undefined || state.userPoolId === undefined) {
    const res = await variableEndpoint.getVariable({ name: 'USER_POOL_ID,USER_POOL_CLIENT_ID' });
    const variable = {
      userPoolClientId: res.data.USER_POOL_CLIENT_ID,
      userPoolId: res.data.USER_POOL_ID,
    };
    dispatch(setVariable(variable));

    return variable;
  }

  return state;
};

export const register = async (email: string, password: string) => {
  const { userPoolClientId, userPoolId } = await getUserPoolVariable();
  const userPool = new CognitoUserPool({
    UserPoolId: userPoolId ?? '',
    ClientId: userPoolClientId ?? '',
  });

  await new Promise((resolve, reject) => {
    userPool.signUp(email, password, [], [], (err, result) => {
      if (err || result === undefined) reject(err);
      else resolve(result.user);
    });
  });
};

export const verify = async (email: string, code: string) => {
  const { userPoolClientId, userPoolId } = await getUserPoolVariable();
  const userPool = new CognitoUserPool({
    UserPoolId: userPoolId ?? '',
    ClientId: userPoolClientId ?? '',
  });
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  await new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
};
