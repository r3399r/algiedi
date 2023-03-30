import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getCurrentUser } from './AuthService';

export const editProfile = async (role: string[], age: string, language: string[], bio: string) => {
  try {
    dispatch(startWaiting());
    const roleAttribute = new CognitoUserAttribute({ Name: 'custom:role', Value: role.join() });
    const languageAttribute = new CognitoUserAttribute({
      Name: 'custom:language',
      Value: language.join(),
    });
    const bioAttribute = new CognitoUserAttribute({
      Name: 'custom:bio',
      Value: bio,
    });
    const ageAttribute = new CognitoUserAttribute({
      Name: 'custom:age',
      Value: age,
    });

    const cognitoUser = await getCurrentUser();
    await new Promise((resolve, reject) => {
      cognitoUser.updateAttributes(
        [roleAttribute, languageAttribute, bioAttribute, ageAttribute],
        (err) => {
          if (err) reject(err);
          else resolve(undefined);
        },
      );
    });
  } finally {
    dispatch(finishWaiting());
  }
};