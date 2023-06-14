import exploreEndpoint from 'src/api/exploreEndpoint';
import { DetailedCreation } from 'src/model/backend/Project';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const loadExplore = async () => {
  try {
    dispatch(startWaiting());

    const res = await exploreEndpoint.getExplore();

    const tracks: DetailedCreation[] = [];
    const lyrics: DetailedCreation[] = [];
    res.data.forEach((v) => {
      if (v.type === 'track') tracks.push(v);
      else if (v.type === 'lyrics') lyrics.push(v);
    });

    return { tracks, lyrics };
  } finally {
    dispatch(finishWaiting());
  }
};
