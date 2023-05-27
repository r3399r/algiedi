import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import meEndpoint from 'src/api/meEndpoint';
import { setMe } from 'src/redux/meSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, setLoadingProfile, startWaiting } from 'src/redux/uiSlice';
import { updateCognitoAttributes } from 'src/util/cognito';

const loadMe = async () => {
  const isLoadingProfile = getState().ui.isLoadingProfile;
  if (isLoadingProfile === true) return;

  try {
    dispatch(setLoadingProfile(true));

    const res = await meEndpoint.getMe();
    const user = res.data;

    dispatch(
      setMe({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role?.split(',') ?? [],
        age: user.age ?? '',
        language: user.language?.split(',') ?? [],
        bio: user.bio ?? '',
        tag: user.tag?.split(',') ?? [],
        facebook: user.facebook ?? '',
        instagram: user.instagram ?? '',
        youtube: user.youtube ?? '',
        soundcloud: user.soundcloud ?? '',
        lastProjectId: user.lastProjectId ?? undefined,
      }),
    );
  } finally {
    dispatch(setLoadingProfile(false));
  }
};

export const loadProfileData = async () => {
  try {
    dispatch(startWaiting());

    await loadMe();
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
