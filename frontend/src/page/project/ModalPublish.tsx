import Button from 'src/component/Button';
import Modal from 'src/component/Modal';
import { DetailedProject } from 'src/model/backend/Project';

type Props = {
  open: boolean;
  handleClose: () => void;
  onPublish: () => void;
  project: DetailedProject;
};

const ModalPublish = ({ open, handleClose, onPublish, project }: Props) => (
  <Modal open={open} handleClose={handleClose}>
    <div>
      <div className="font-bold text-xl">
        Please browse the file to upload, and check the content. Note that this action is
        irreversible.
      </div>
      <div>Cover File:</div>
      <div>
        {project.coverFileUrl ? (
          <img src={project.coverFileUrl} />
        ) : (
          <div className="bg-gray-400 h-8" />
        )}
      </div>
      <div>Name: {project.name}</div>
      <div className="whitespace-pre">
        Description:
        <br />
        {project.description}
      </div>
      <div>Theme: {project.theme}</div>
      <div>Genre: {project.genre}</div>
      <div>Language: {project.language}</div>
      <div>Caption: {project.caption}</div>
      <div className="whitespace-pre">Lyrics: {project.song?.lyricsText}</div>
      <audio
        src={project.song?.fileUrl ?? undefined}
        controls
        // onLoadedMetadata={onLoadMetadata}
      />
      <Button onClick={onPublish}>Publish</Button>
      <Button color="purple" onClick={handleClose}>
        Cancel
      </Button>
    </div>
  </Modal>
);

export default ModalPublish;
