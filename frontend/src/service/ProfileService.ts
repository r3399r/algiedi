import meEndpoint from 'src/api/meEndpoint';
import userEndpoint from 'src/api/userEndpoint';
import { setMe } from 'src/redux/meSlice';
import { dispatch } from 'src/redux/store';
import { finishWaiting, setLoadingProfile, startWaiting } from 'src/redux/uiSlice';
import { file2Base64 } from 'src/util/fileConverter';

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
      region: user.region ?? '',
      language: user.language === null || user.language === '' ? [] : user.language.split(','),
      bio: user.bio ?? '',
      tag: user.tag === null || user.tag === '' ? [] : user.tag.split(','),
      facebook: user.facebook ?? '',
      instagram: user.instagram ?? '',
      youtube: user.youtube ?? '',
      soundcloud: user.soundcloud ?? '',
      avatar: user.avatarUrl,
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

export const getPublished = async (limit: string, offset: string) => {
  try {
    dispatch(startWaiting());

    const res = await meEndpoint.getMeExhibitsPublished({
      limit,
      offset,
    });

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getOriginal = async (type: string, limit: string, offset: string) => {
  try {
    dispatch(startWaiting());

    const res = await meEndpoint.getMeExhibitsOriginal({
      type: type === 'All' ? undefined : type,
      limit,
      offset,
    });

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getInspiration = async (type: string, limit: string, offset: string) => {
  try {
    dispatch(startWaiting());

    const res = await meEndpoint.getMeExhibitsInspiration({
      type: type === 'All' ? undefined : type,
      limit,
      offset,
    });

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getLikes = async (limit: string, offset: string) => {
  try {
    dispatch(startWaiting());

    const res = await meEndpoint.getMeExhibitsLikes({
      limit,
      offset,
    });

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getFollows = async (role: string, limit: string, offset: string) => {
  try {
    dispatch(startWaiting());

    const res = await meEndpoint.getMeExhibitsFollows({
      role: role === 'All' ? undefined : role,
      limit,
      offset,
    });

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const editProfile = async (
  role: string[],
  age: string,
  region: string,
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
      region,
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
        region: user.region ?? '',
        language: user.language === null || user.language === '' ? [] : user.language.split(','),
        bio: user.bio ?? '',
        tag: user.tag === null || user.tag === '' ? [] : user.tag.split(','),
        facebook: user.facebook ?? '',
        instagram: user.instagram ?? '',
        youtube: user.youtube ?? '',
        soundcloud: user.soundcloud ?? '',
        avatar: user.avatarUrl,
        lastProjectId: user.lastProjectId ?? undefined,
      }),
    );
  } finally {
    dispatch(finishWaiting());
  }
};

export const updateAvatar = async (avatarFile: File) => {
  try {
    dispatch(startWaiting());
    await userEndpoint.putUserAvatar({ file: await file2Base64(avatarFile) });
  } finally {
    dispatch(finishWaiting());
  }
};
