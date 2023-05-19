import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import uploadEndpoint from 'src/api/uploadEndpoint';
import { UploadLyricsForm, UploadTrackForm } from 'src/model/Form';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { file2Base64 } from 'src/util/fileConverter';
import { updateCognitoAttributes } from './AuthService';
import { loadProjects } from './OverallService';

const updateLastProjectId = async (projectId: string) => {
  const lastProjectAttribute = new CognitoUserAttribute({
    Name: 'custom:last_project_id',
    Value: projectId,
  });

  await updateCognitoAttributes([lastProjectAttribute]);
};

export const uploadTrack = async (
  data: UploadTrackForm,
  files: { track: File; tab: File | null; cover: File | null },
) => {
  try {
    dispatch(startWaiting());
    const res = await uploadEndpoint.postUpload({
      type: 'track',
      inspiredProjectId: null,
      file: await file2Base64(files.track),
      tabFile: files.tab ? await file2Base64(files.tab) : null,
      coverFile: files.cover ? await file2Base64(files.cover) : null,
      ...data,
    });

    await updateLastProjectId(res.data.id);
    await loadProjects();
  } catch (err) {
    throw (err as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};

export const uploadLyrics = async (data: UploadLyricsForm, coverFile: File | null) => {
  try {
    dispatch(startWaiting());
    const res = await uploadEndpoint.postUpload({
      type: 'lyrics',
      inspiredProjectId: null,
      coverFile: coverFile ? await file2Base64(coverFile) : null,
      ...data,
    });

    await updateLastProjectId(res.data.id);
    await loadProjects();
  } catch (err) {
    throw (err as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};
