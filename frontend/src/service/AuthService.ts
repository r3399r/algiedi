import { CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import variableEndpoint from 'src/api/variableEndpoint';
import { RegistrationForm } from 'src/model/Form';
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

export const register = async (data: RegistrationForm) => {
  const { userPoolClientId, userPoolId } = await getUserPoolVariable();
  const userPool = new CognitoUserPool({
    UserPoolId: userPoolId ?? '',
    ClientId: userPoolClientId ?? '',
  });

  const firstName = new CognitoUserAttribute({ Name: 'custom:first_name', Value: data.firstName });
  const lastName = new CognitoUserAttribute({ Name: 'custom:last_name', Value: data.lastName });

  await new Promise((resolve, reject) => {
    userPool.signUp(data.email, data.password, [firstName, lastName], [], (err, result) => {
      if (err || result === undefined) reject(err);
      else resolve(result.user);
    });
  });
};

export const resendVerificationEmail = async (email: string) => {
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
    cognitoUser.resendConfirmationCode((err) => {
      if (err) reject(err);
      else resolve(undefined);
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
