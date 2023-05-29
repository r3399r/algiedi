import meEndpoint from 'src/api/meEndpoint';
import { setMe } from 'src/redux/meSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, setLoadingProfile, startWaiting } from 'src/redux/uiSlice';

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
