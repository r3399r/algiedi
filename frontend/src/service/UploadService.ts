import uploadEndpoint from 'src/api/uploadEndpoint';
import { UploadLyricsForm, UploadTrackForm } from 'src/model/Form';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { file2Base64 } from 'src/util/fileConverter';

export const uploadTrack = async (
  data: UploadTrackForm,
  files: { track: File; tab: File | null; cover: File | null },
) => {
  try {
    dispatch(startWaiting());
    await uploadEndpoint.postUpload({
      type: 'track',
      inspiredProjectId: null,
      file: await file2Base64(files.track),
      tabFile: files.tab ? await file2Base64(files.tab) : null,
      coverFile: files.cover ? await file2Base64(files.cover) : null,
      ...data,
    });
  } catch (err) {
    throw (err as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};

export const uploadLyrics = async (data: UploadLyricsForm, coverFile: File | null) => {
  try {
    dispatch(startWaiting());
    await uploadEndpoint.postUpload({
      type: 'lyrics',
      inspiredProjectId: null,
      coverFile: coverFile ? await file2Base64(coverFile) : null,
      ...data,
    });
  } catch (err) {
    throw (err as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};
