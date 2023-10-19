import { ChangeEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import Input from 'src/component/Input';
import Modal from 'src/component/Modal';
import { DetailedCreation } from 'src/model/backend/Project';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { updateCreation } from 'src/service/ProjectService';

type Props = {
  open: boolean;
  handleClose: () => void;
  targetCreation: DetailedCreation | null;
  doRefresh: () => void;
};

const ModalMaster = ({ open, handleClose, targetCreation, doRefresh }: Props) => {
  const dispatch = useDispatch();
  const trackInputRef = useRef<HTMLInputElement>(null);
  const tabInputRef = useRef<HTMLInputElement>(null);
  const [lyrics, setLyrics] = useState<string>(targetCreation?.lyricsText ?? '');
  const [trackFile, setTrackFile] = useState<File>();
  const [tabFile, setTabFile] = useState<File>();
  const [errorTrackFile, setErrorTrackFile] = useState<boolean>(false);

  const onSuccess = () => {
    doRefresh();
    handleClose();
  };

  const onSubmit = () => {
    if (targetCreation === null) return;
    updateCreation(
      targetCreation.id,
      { tab: tabFile ?? null, track: trackFile ?? null },
      lyrics ?? '',
    )
      .then(onSuccess)
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <Modal open={open} handleClose={handleClose}>
      <div>
        <div className="text-2xl font-bold">Track</div>
        <div className="my-4 flex items-center gap-2">
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
        <div className="my-4 flex items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="Select a 30 sec. tab file (pdf.)"
              value={tabFile?.name ?? ''}
              onClick={() => tabInputRef.current?.click()}
            />
          </div>
          <Button size="m" color="purple" onClick={() => trackInputRef.current?.click()}>
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
        <div className="text-2xl font-bold">Lyrics</div>
        <textarea
          className="my-2 h-[200px] w-full rounded border border-black px-2"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
        />
        <div className="text-right">
          <Button onClick={onSubmit}>Submit</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalMaster;
