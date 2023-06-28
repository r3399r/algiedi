import exploreEndpoint from 'src/api/exploreEndpoint';
import projectEndpoint from 'src/api/projectEndpoint';
import uploadEndpoint from 'src/api/uploadEndpoint';
import { UploadLyricsForm, UploadTrackForm } from 'src/model/Form';
import { setLastProjectId } from 'src/redux/meSlice';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { file2Base64 } from 'src/util/fileConverter';
import { loadProjects } from './OverallService';

export const updateLastProjectId = async (projectId: string) => {
  await projectEndpoint.patchProjectIdView(projectId);
  dispatch(setLastProjectId(projectId));
};

export const uploadTrack = async (
  data: UploadTrackForm,
  files: { track: File; tab: File | null; cover: File | null },
  inspiredId: string | null,
) => {
  try {
    dispatch(startWaiting());
    const res = await uploadEndpoint.postUpload({
      type: 'track',
      file: await file2Base64(files.track),
      tabFile: files.tab ? await file2Base64(files.tab) : null,
      coverFile: files.cover ? await file2Base64(files.cover) : null,
      inspiredId,
      ...data,
    });

    await updateLastProjectId(res.data.id);
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
    const res = await uploadEndpoint.postUpload({
      type: 'lyrics',
      coverFile: coverFile ? await file2Base64(coverFile) : null,
      inspiredId,
      ...data,
    });

    await updateLastProjectId(res.data.id);
    await loadProjects();
  } finally {
    dispatch(finishWaiting());
  }
};

export const getExplore = async () => {
  try {
    dispatch(startWaiting());

    const res = await exploreEndpoint.getExplore();

    // const tracks: DetailedCreation[] = [];
    // const lyrics: DetailedCreation[] = [];
    // res.data.forEach((v) => {
    //   if (v.type === 'track') tracks.push(v);
    //   else if (v.type === 'lyrics') lyrics.push(v);
    // });

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};
