import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import Modal from 'src/component/Modal';
import ModalConfirmLeave from 'src/component/ModalConfirmLeave';
import { DetailedCreation } from 'src/model/backend/Project';
import { openFailSnackbar, setHasUnsavedChanges } from 'src/redux/uiSlice';
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
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  useEffect(() => {
    dispatch(setHasUnsavedChanges(!!lyrics));
  }, [lyrics]);

  const onSuccess = () => {
    doRefresh();
    handleClose();
    setLyrics(undefined);
  };

  const onClose = () => {
    if (lyrics) setOpenConfirm(true);
    else handleClose();
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
    <>
      <Modal open={open} handleClose={onClose}>
        <div>
          <div className="text-2xl font-bold">Lyrics</div>
          <textarea
            className="my-2 h-[200px] w-full rounded border border-black px-2"
            value={lyrics}
            defaultValue={targetLyrics?.lyricsText ?? ''}
            onChange={(e) => setLyrics(e.target.value)}
          />
          <div className="text-right">
            <Button onClick={onSubmit} disabled={!lyrics}>
              Submit
            </Button>
          </div>
        </div>
      </Modal>
      <ModalConfirmLeave
        open={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        onComfirm={() => {
          setOpenConfirm(false);
          handleClose();
          setLyrics(undefined);
        }}
      />
    </>
  );
};

export default ModalLyrics;
