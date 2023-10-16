import creationEndpoint from 'src/api/creationEndpoint';
import exploreEndpoint from 'src/api/exploreEndpoint';
import userEndpoint from 'src/api/userEndpoint';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { Type } from 'src/model/backend/constant/Creation';
import { setExplores } from 'src/redux/apiSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const getExplore = async () => {
  try {
    const { isLogin } = getState().ui;
    dispatch(startWaiting());

    const res = isLogin
      ? await exploreEndpoint.getExploreAuth()
      : await exploreEndpoint.getExplore();

    dispatch(setExplores(res.data.data));

    const tracks: GetExploreResponse = [];
    const lyrics: GetExploreResponse = [];
    const songs: GetExploreResponse = [];
    res.data.data.forEach((v) => {
      if (v.type === Type.Track) tracks.push(v);
      else if (v.type === Type.Lyrics) lyrics.push(v);
      else if (v.type === Type.Song) songs.push(v);
    });

    return {
      tracks,
      lyrics,
      songs,
    };
  } finally {
    dispatch(finishWaiting());
  }
};

export const getExploreIdea = async (type: Type[], limit: string, offset: string) => {
  try {
    const { isLogin } = getState().ui;
    dispatch(startWaiting());

    const res = isLogin
      ? await exploreEndpoint.getExploreAuth({ type: type.join(), limit, offset })
      : await exploreEndpoint.getExplore({ type: type.join(), limit, offset });

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getExploreById = async (id: string) => {
  try {
    const { isLogin } = getState().ui;
    dispatch(startWaiting());

    const res = isLogin
      ? await exploreEndpoint.getExploreIdAuth(id)
      : await exploreEndpoint.getExploreId(id);

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const likeById = async (id: string) => {
  try {
    dispatch(startWaiting());

    await creationEndpoint.postCreationIdLike(id);
  } finally {
    dispatch(finishWaiting());
  }
};

export const unlikeById = async (id: string) => {
  try {
    dispatch(startWaiting());

    await creationEndpoint.postCreationIdUnlike(id);
  } finally {
    dispatch(finishWaiting());
  }
};

export const commentById = async (id: string, comment: string) => {
  try {
    dispatch(startWaiting());

    await creationEndpoint.postCreationIdComment(id, { comment });
  } finally {
    dispatch(finishWaiting());
  }
};

export const followByUserId = async (id: string) => {
  try {
    dispatch(startWaiting());

    await userEndpoint.postUserIdFollow(id);
  } finally {
    dispatch(finishWaiting());
  }
};

export const unfollowByUserId = async (id: string) => {
  try {
    dispatch(startWaiting());

    await userEndpoint.postUserIdUnfollow(id);
  } finally {
    dispatch(finishWaiting());
  }
};
