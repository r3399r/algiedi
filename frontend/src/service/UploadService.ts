import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import uploadEndpoint from 'src/api/uploadEndpoint';
import { UploadLyricsForm, UploadTrackForm } from 'src/model/Form';
import { setLastProjectId } from 'src/redux/meSlice';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { file2Base64 } from 'src/util/fileConverter';
import { updateCognitoAttributes } from './AuthService';
import { loadProjects } from './OverallService';

export const updateLastProjectId = async (projectId: string) => {
  const lastProjectAttribute = new CognitoUserAttribute({
    Name: 'custom:last_project_id',
    Value: projectId,
  });

  await updateCognitoAttributes([lastProjectAttribute]);
  dispatch(setLastProjectId(projectId));
};

export const uploadTrack = async (
  data: UploadTrackForm,
  isOriginal: boolean,
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
      isOriginal,
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
  isOriginal: boolean,
  coverFile: File | null,
  inspiredId: string | null,
) => {
  try {
    dispatch(startWaiting());
    const res = await uploadEndpoint.postUpload({
      type: 'lyrics',
      coverFile: coverFile ? await file2Base64(coverFile) : null,
      isOriginal,
      inspiredId,
      ...data,
    });

    await updateLastProjectId(res.data.id);
    await loadProjects();
  } finally {
    dispatch(finishWaiting());
  }
};
