import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import Modal from 'src/component/Modal';
import { DetailedCreation } from 'src/model/backend/Project';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { updateLyrics, uploadLyrics } from 'src/service/ProjectService';

type Props = {
  open: boolean;
  handleClose: () => void;
  targetLyrics: DetailedCreation | null;
  targetProjectId: string;
  doRefresh: () => void;
};

const ModalLyrics = ({ open, handleClose, targetLyrics, targetProjectId, doRefresh }: Props) => {
  const dispatch = useDispatch();
  const [lyrics, setLyrics] = useState<string>();

  const onSuccess = () => {
    doRefresh();
    handleClose();
    setLyrics(undefined);
  };

  const onSubmit = () => {
    if (!lyrics) return;
    if (targetLyrics !== null)
      updateLyrics(targetLyrics.id, lyrics)
        .then(onSuccess)
        .catch((err) => dispatch(openFailSnackbar(err)));
    else
      uploadLyrics(targetProjectId, lyrics)
        .then(onSuccess)
        .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <Modal open={open} handleClose={handleClose}>
      <div>
        <div className="font-bold text-2xl">Lyrics</div>
        <textarea
          className="w-full border border-black px-2 rounded h-[200px] my-2"
          value={lyrics}
          defaultValue={targetLyrics?.lyricsText ?? ''}
          onChange={(e) => setLyrics(e.target.value)}
        />
        <div className="text-right">
          <Button onClick={onSubmit}>Submit</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalLyrics;
