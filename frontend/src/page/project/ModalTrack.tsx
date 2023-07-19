import { ChangeEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import Input from 'src/component/Input';
import Modal from 'src/component/Modal';
import { DetailedCreation } from 'src/model/backend/Project';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { updateTrack, uploadTrack } from 'src/service/ProjectService';

type Props = {
  open: boolean;
  handleClose: () => void;
  targetTrack: DetailedCreation | null;
  targetProjectId: string;
  doRefresh: () => void;
};

const ModalTrack = ({ open, handleClose, targetTrack, targetProjectId, doRefresh }: Props) => {
  const dispatch = useDispatch();
  const trackInputRef = useRef<HTMLInputElement>(null);
  const tabInputRef = useRef<HTMLInputElement>(null);
  const [trackFile, setTrackFile] = useState<File>();
  const [tabFile, setTabFile] = useState<File>();
  const [errorTrackFile, setErrorTrackFile] = useState<boolean>(false);

  const onSuccess = () => {
    doRefresh();
    handleClose();
    setTrackFile(undefined);
    setTabFile(undefined);
  };

  const onSubmit = () => {
    if (!trackFile) return;
    if (targetTrack !== null)
      updateTrack(targetTrack.id, { tab: tabFile ?? null, track: trackFile })
        .then(onSuccess)
        .catch((err) => dispatch(openFailSnackbar(err)));
    else
      uploadTrack(targetProjectId, { tab: tabFile ?? null, track: trackFile })
        .then(onSuccess)
        .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <Modal open={open} handleClose={handleClose}>
      <div>
        <div className="font-bold text-2xl">Track</div>
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1">
            <Input
              placeholder="*Select a file (mp3. or wav.)"
              value={trackFile?.name ?? ''}
              onClick={() => trackInputRef.current?.click()}
              error={errorTrackFile}
            />
          </div>
          <Button size="m" color="purple" onClick={() => trackInputRef.current?.click()}>
            Browse...
          </Button>
        </div>
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1">
            <Input
              placeholder="Select a 30 sec. tab file (pdf.)"
              value={tabFile?.name ?? ''}
              onClick={() => tabInputRef.current?.click()}
            />
          </div>
          <Button size="m" color="purple" onClick={() => tabInputRef.current?.click()}>
            Browse...
          </Button>
        </div>
        <input
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length === 1) setTrackFile(e.target.files[0]);
            setErrorTrackFile(false);
          }}
          ref={trackInputRef}
          className="hidden"
          accept="audio/vnd.wave,audio/mpeg"
          multiple={false}
        />
        <input
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length === 1) setTabFile(e.target.files[0]);
          }}
          ref={tabInputRef}
          className="hidden"
          accept="application/pdf"
          multiple={false}
        />
        <div className="text-right">
          <Button onClick={onSubmit}>Submit</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalTrack;
