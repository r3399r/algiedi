import exploreEndpoint from 'src/api/exploreEndpoint';
import uploadEndpoint from 'src/api/uploadEndpoint';
import { UploadLyricsForm, UploadTrackForm } from 'src/model/Form';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { file2Base64 } from 'src/util/fileConverter';
import { loadProjects } from './OverallService';

export const uploadTrack = async (
  data: UploadTrackForm,
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
      ...data,
    });

    await loadProjects();
  } finally {
    dispatch(finishWaiting());
  }
};

export const uploadLyrics = async (
  data: UploadLyricsForm,
  coverFile: File | null,
  inspiredId: string | null,
) => {
  try {
    dispatch(startWaiting());
    await uploadEndpoint.postUpload({
      type: 'lyrics',
      coverFile: coverFile ? await file2Base64(coverFile) : null,
      inspiredId,
      ...data,
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
