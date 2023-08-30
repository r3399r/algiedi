import meEndpoint from 'src/api/meEndpoint';
import userEndpoint from 'src/api/userEndpoint';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { GetMeSocialResponse } from 'src/model/backend/api/Me';
import { setMe } from 'src/redux/meSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, setLoadingProfile, startWaiting } from 'src/redux/uiSlice';
import { file2Base64 } from 'src/util/fileConverter';
import { getExplore } from './ExploreService';

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

export const getSocials = async (): Promise<GetMeSocialResponse> => {
  try {
    dispatch(startWaiting());

    const res = await meEndpoint.getMeSocial();

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getExplores = async (): Promise<{
  published: GetExploreResponse;
  original: GetExploreResponse;
  inspiration: GetExploreResponse;
}> => {
  try {
    dispatch(startWaiting());
    const state = getState();

    let tracks: GetExploreResponse = [];
    let lyrics: GetExploreResponse = [];
    let songs: GetExploreResponse = [];
    if (!state.api.explores) {
      const res = await getExplore();
      tracks = res.tracks;
      lyrics = res.lyrics;
      songs = res.songs;
    } else {
      tracks = state.api.explores.filter((v) => v.type === 'track');
      lyrics = state.api.explores.filter((v) => v.type === 'lyrics');
      songs = state.api.explores.filter((v) => v.type === 'song');
    }

    const published = songs.filter((v) => v.author.map((o) => o.id).includes(state.me.id));
    const original = [...tracks, ...lyrics].filter(
      (v) => v.inspiredId === null && v.userId === state.me.id,
    );
    const inspiration = [...tracks, ...lyrics, ...songs].filter(
      (v) => v.inspiredId !== null && v.userId === state.me.id,
    );

    return {
      published,
      original,
      inspiration,
    };
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
