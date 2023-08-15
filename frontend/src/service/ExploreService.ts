import creationEndpoint from 'src/api/creationEndpoint';
import exploreEndpoint from 'src/api/exploreEndpoint';
import userEndpoint from 'src/api/userEndpoint';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const getExplore = async () => {
  try {
    dispatch(startWaiting());

    const res = await exploreEndpoint.getExplore();

    const tracks: GetExploreResponse = [];
    const lyrics: GetExploreResponse = [];
    const songs: GetExploreResponse = [];
    res.data.forEach((v) => {
      if (v.type === 'track') tracks.push(v);
      else if (v.type === 'lyrics') lyrics.push(v);
      else if (v.type === 'song') songs.push(v);
    });

    return { tracks, lyrics, songs };
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
