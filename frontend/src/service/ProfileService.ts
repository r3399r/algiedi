import meEndpoint from 'src/api/meEndpoint';
import { setMe } from 'src/redux/meSlice';
import { dispatch } from 'src/redux/store';
import { finishWaiting, setLoadingProfile, startWaiting } from 'src/redux/uiSlice';

const loadMe = async () => {
  try {
    dispatch(setLoadingProfile(true));

    const res = await meEndpoint.getMe();
    const user = res.data;

    const me = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role === null || user.role === '' ? [] : user.role.split(','),
      age: String(user.age ?? ''),
      language: user.language === null || user.language === '' ? [] : user.language.split(','),
      bio: user.bio ?? '',
      tag: user.tag === null || user.tag === '' ? [] : user.tag.split(','),
      facebook: user.facebook ?? '',
      instagram: user.instagram ?? '',
      youtube: user.youtube ?? '',
      soundcloud: user.soundcloud ?? '',
      lastProjectId: user.lastProjectId ?? undefined,
    };
    dispatch(setMe(me));

    return me;
  } catch {
    throw new Error('loadMe error');
  } finally {
    dispatch(setLoadingProfile(false));
  }
};

export const loadProfileData = async () => {
  try {
    dispatch(startWaiting());

    return await loadMe();
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

    const res = await meEndpoint.putMe({
      role: role.join(),
      language: language.join(),
      bio,
      age,
      tag: tag.join(),
      facebook,
      instagram,
      youtube,
      soundcloud,
    });
    const user = res.data;

    dispatch(
      setMe({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role === null || user.role === '' ? [] : user.role.split(','),
        age: String(user.age ?? ''),
        language: user.language === null || user.language === '' ? [] : user.language.split(','),
        bio: user.bio ?? '',
        tag: user.tag === null || user.tag === '' ? [] : user.tag.split(','),
        facebook: user.facebook ?? '',
        instagram: user.instagram ?? '',
        youtube: user.youtube ?? '',
        soundcloud: user.soundcloud ?? '',
        lastProjectId: user.lastProjectId ?? undefined,
      }),
    );
  } finally {
    dispatch(finishWaiting());
  }
};
