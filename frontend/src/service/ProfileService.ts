import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { loadUserAttributes, updateCognitoAttributes } from './AuthService';

export const loadProfileData = async () => {
  try {
    dispatch(startWaiting());
    await loadUserAttributes();
  } finally {
    dispatch(finishWaiting());
  }
};

export const editProfile = async (
  role: string[],
  age: string,
  language: string[],
  bio: string,
  tag: string[],
  facebook: string,
  instagram: string,
  youtube: string,
  soundcloud: string,
) => {
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
    const tagAttribute = new CognitoUserAttribute({
      Name: 'custom:tag',
      Value: tag.join(),
    });
    const facebookAttribute = new CognitoUserAttribute({
      Name: 'custom:facebook',
      Value: facebook,
    });
    const instagramAttribute = new CognitoUserAttribute({
      Name: 'custom:instagram',
      Value: instagram,
    });
    const youtubeAttribute = new CognitoUserAttribute({
      Name: 'custom:youtube',
      Value: youtube,
    });
    const soundcloudAttribute = new CognitoUserAttribute({
      Name: 'custom:soundcloud',
      Value: soundcloud,
    });

    await updateCognitoAttributes([
      roleAttribute,
      languageAttribute,
      bioAttribute,
      ageAttribute,
      tagAttribute,
      facebookAttribute,
      instagramAttribute,
      youtubeAttribute,
      soundcloudAttribute,
    ]);
  } finally {
    dispatch(finishWaiting());
  }
};
