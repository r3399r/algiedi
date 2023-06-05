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
  targetLyrics?: DetailedCreation;
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
    if (targetLyrics !== undefined)
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
        <div>lyrics</div>
        <textarea
          className="w-full border-[1px] border-black px-2 rounded"
          value={lyrics}
          defaultValue={targetLyrics?.lyrics ?? ''}
          onChange={(e) => setLyrics(e.target.value)}
        />
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </Modal>
  );
};

export default ModalLyrics;
