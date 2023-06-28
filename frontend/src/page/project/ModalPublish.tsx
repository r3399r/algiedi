import { ChangeEvent, useRef, useState } from 'react';
import Button from 'src/component/Button';
import Input from 'src/component/Input';
import Modal from 'src/component/Modal';

type Props = {
  open: boolean;
  handleClose: () => void;
  onPublish: (file: File) => void;
  data: {
    coverFileUrl: string | null;
    name: string;
    description: string;
    theme: string;
    genre: string;
    language: string;
    caption: string;
  };
};

const ModalPublish = ({ open, handleClose, onPublish, data }: Props) => {
  const trackInputRef = useRef<HTMLInputElement>(null);
  const [errorTrackFile, setErrorTrackFile] = useState<boolean>(false);
  const [trackFile, setTrackFile] = useState<File>();

  return (
    <Modal open={open} handleClose={handleClose}>
      <div>
        <div className="font-bold text-xl">
          Please browse the file to upload, and check the content. Note that this action is
          irreversible.
        </div>
        <div>Cover File:</div>
        <div>
          {data.coverFileUrl ? (
            <img src={data.coverFileUrl} />
          ) : (
            <div className="bg-gray-400 h-8" />
          )}
        </div>
        <div>Name: {data.name}</div>
        <div className="whitespace-pre">
          Description:
          <br />
          {data.description}
        </div>
        <div>Theme: {data.theme}</div>
        <div>Genre: {data.genre}</div>
        <div>Language: {data.language}</div>
        <div>Caption: {data.caption}</div>
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="*Select a file (mp3. or wav.)"
            divClassName="w-3/5"
            value={trackFile?.name ?? ''}
            onClick={() => trackInputRef.current?.click()}
            error={errorTrackFile}
          />
          <Button onClick={() => trackInputRef.current?.click()}>Browse...</Button>
        </div>
        <Button
          onClick={() => {
            if (trackFile) onPublish(trackFile);
          }}
        >
          Publish
        </Button>
        <Button appearance="secondary" onClick={handleClose}>
          Cancel
        </Button>
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
      </div>
    </Modal>
  );
};

export default ModalPublish;
