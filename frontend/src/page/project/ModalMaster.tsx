import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import Checkbox from 'src/component/Checkbox';
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
  const [updateTrackFile, setUpdateTrackFile] = useState<boolean>(false);
  const [updateTabFile, setUpdateTabFile] = useState<boolean>(false);

  const submittable = useMemo(() => {
    if (targetCreation?.fileUrl === null && trackFile) return true;
    if (updateTrackFile) if (trackFile) return true;
    if (targetCreation?.fileUrl !== null && lyrics !== targetCreation?.lyricsText) return true;

    return updateTabFile;
  }, [targetCreation, updateTrackFile, updateTabFile, trackFile, lyrics]);

  const onClose = () => {
    handleClose();
    setUpdateTrackFile(false);
    setUpdateTabFile(false);
    setTrackFile(undefined);
    setTabFile(undefined);
  };

  const onSuccess = () => {
    doRefresh();
    onClose();
  };

  const onSubmit = () => {
    if (!submittable) return;
    if (targetCreation === null) return;
    updateCreation(
      targetCreation.id,
      { tab: updateTabFile ? tabFile ?? null : tabFile, track: trackFile },
      lyrics ?? '',
    )
      .then(onSuccess)
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <Modal open={open} handleClose={onClose}>
      <div>
        <div className="text-2xl font-bold">Track</div>
        <div className="my-4">
          {targetCreation?.fileUrl && (
            <Checkbox
              label="update track file"
              checked={updateTrackFile}
              onChange={(e) => {
                setUpdateTrackFile(e.target.checked);
                if (!e.target.checked) setTrackFile(undefined);
              }}
            />
          )}
          {(!targetCreation?.fileUrl || updateTrackFile) && (
            <div className="flex items-center gap-2">
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
          )}
        </div>
        <div className="my-4">
          {targetCreation?.fileUrl && (
            <Checkbox
              label="update tab file (remain empty to delete)"
              checked={updateTabFile}
              onChange={(e) => {
                setUpdateTabFile(e.target.checked);
                if (!e.target.checked) setTabFile(undefined);
              }}
            />
          )}
          {(!targetCreation?.fileUrl || updateTabFile) && (
            <div className="flex items-center gap-2">
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
          )}
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
          <Button onClick={onSubmit} disabled={!submittable}>
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalMaster;
