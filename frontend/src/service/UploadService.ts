import exploreEndpoint from 'src/api/exploreEndpoint';
import uploadEndpoint from 'src/api/uploadEndpoint';
import { ExploreCreation } from 'src/model/backend/Explore';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { file2Base64 } from 'src/util/fileConverter';
import { loadProjects } from './OverallService';

export const uploadTrack = async (
  data: {
    name: string;
    description: string;
    theme: string;
    genre: string;
    language: string;
    caption: string;
  },
  files: { track: File; tab: File | null; cover: File | null },
  inspiredId: string | null,
) => {
  try {
    dispatch(startWaiting());
    await uploadEndpoint.postUpload({
      type: 'track',
      file: await file2Base64(files.track),
      tabFile: files.tab ? await file2Base64(files.tab) : null,
      coverFile: files.cover ? await file2Base64(files.cover) : null,
      inspiredId,
      name: data.name,
      description: data.description,
      theme: data.theme,
      genre: data.genre,
      language: data.language,
      caption: data.caption.match(/#[\p{L}0-9]+/giu) ?? undefined,
    });

    await loadProjects();
  } finally {
    dispatch(finishWaiting());
  }
};

export const uploadLyrics = async (
  data: {
    name: string;
    description: string;
    lyrics: string;
    theme: string;
    genre: string;
    language: string;
    caption: string;
  },
  coverFile: File | null,
  inspiredId: string | null,
) => {
  try {
    dispatch(startWaiting());
    await uploadEndpoint.postUpload({
      type: 'lyrics',
      coverFile: coverFile ? await file2Base64(coverFile) : null,
      inspiredId,
      name: data.name,
      description: data.description,
      theme: data.theme,
      genre: data.genre,
      language: data.language,
      caption: data.caption.match(/#[\p{L}0-9]+/giu) ?? undefined,
      lyrics: data.lyrics,
    });

    await loadProjects();
  } finally {
    dispatch(finishWaiting());
  }
};

export const getExplore = async () => {
  try {
    dispatch(startWaiting());

    const res = await exploreEndpoint.getExplore();

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const getExploreSearch = async (keyword: string, type?: string) => {
  const res = await exploreEndpoint.getExploreSearch({ keyword, type });

  return res.data as unknown as ExploreCreation[];
};
