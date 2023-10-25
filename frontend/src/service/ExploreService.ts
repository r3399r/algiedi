import { subMonths, subWeeks, subYears } from 'date-fns';
import creationEndpoint from 'src/api/creationEndpoint';
import exploreEndpoint from 'src/api/exploreEndpoint';
import userEndpoint from 'src/api/userEndpoint';
import {
  GetExploreParams,
  GetExploreResponse,
  GetExploreUserParams,
} from 'src/model/backend/api/Explore';
import { Type } from 'src/model/backend/constant/Creation';
import { Status } from 'src/model/backend/constant/Project';
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

export const getExploreSong = async (params: {
  genre: string;
  theme: string;
  limit: string;
  offset: string;
  tab: number;
  keyword?: string;
}) => {
  try {
    const { isLogin } = getState().ui;
    dispatch(startWaiting());
    let begin: string | undefined = undefined;
    let end: string | undefined = new Date().toISOString();
    if (params.tab === 1) begin = subWeeks(new Date(), 1).toISOString();
    else if (params.tab === 2) begin = subMonths(new Date(), 1).toISOString();
    else if (params.tab === 3) begin = subYears(new Date(), 1).toISOString();
    else end = undefined;

    const exploreParams: GetExploreParams = {
      type: Type.Song,
      genre: params.genre === 'All' ? undefined : params.genre,
      theme: params.theme === 'All' ? undefined : params.theme,
      keyword: params.keyword,
      limit: params.limit,
      offset: params.offset,
      begin,
      end,
    };
    const res = isLogin
      ? await exploreEndpoint.getExploreAuth(exploreParams)
      : await exploreEndpoint.getExplore(exploreParams);

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getExploreFeatured = async () => {
  try {
    dispatch(startWaiting());
    const res = await exploreEndpoint.getExploreFeatured();

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getExploreIdea = async (params: {
  type: Type[];
  genre: string;
  theme: string;
  limit: string;
  offset: string;
  status: Status | 'All' | 'Null';
  keyword?: string;
}) => {
  try {
    const { isLogin } = getState().ui;
    dispatch(startWaiting());

    let status: Status | undefined | 'null' = 'null';
    if (params.status === 'All') status = undefined;
    else if (params.status !== 'Null') status = params.status;
    const exploreParams: GetExploreParams = {
      type: params.type.join(),
      genre: params.genre === 'All' ? undefined : params.genre,
      theme: params.theme === 'All' ? undefined : params.theme,
      keyword: params.keyword,
      status,
      limit: params.limit,
      offset: params.offset,
    };
    const res = isLogin
      ? await exploreEndpoint.getExploreAuth(exploreParams)
      : await exploreEndpoint.getExplore(exploreParams);

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getExploreUser = async (params: {
  limit: string;
  offset: string;
  keyword?: string;
  role: string;
}) => {
  try {
    const { isLogin } = getState().ui;
    dispatch(startWaiting());

    const exploreParams: GetExploreUserParams = {
      keyword: params.keyword,
      limit: params.limit,
      offset: params.offset,
      role: params.role === 'All' ? undefined : params.role,
    };
    const res = isLogin
      ? await exploreEndpoint.getExploreUserAuth(exploreParams)
      : await exploreEndpoint.getExploreUser(exploreParams);

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

export const getExploreSearch = async (keyword: string, type: string) =>
  await exploreEndpoint.getExploreSearch({ keyword, type });
