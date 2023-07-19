import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Button from 'src/component/Button';
import Cover from 'src/component/Cover';
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
        Please check the content. Note that this action is irreversible.
      </div>
      <Cover url={project.coverFileUrl} />
      <div className="flex gap-2">
        <div className="w-[100px] font-bold">Name</div>
        <div>{project.name}</div>
      </div>
      <div className="flex gap-2">
        <div className="w-[100px] font-bold">Description</div>
        <div className="whitespace-pre">{project.description}</div>
      </div>
      <div className="flex gap-2">
        <div className="w-[100px] font-bold">Theme</div>
        <div>{project.theme}</div>
      </div>
      <div className="flex gap-2">
        <div className="w-[100px] font-bold">Genre</div>
        <div>{project.genre}</div>
      </div>
      <div className="flex gap-2">
        <div className="w-[100px] font-bold">Language</div>
        <div>{project.language}</div>
      </div>
      <div className="flex gap-2">
        <div className="w-[100px] font-bold">Caption</div>
        <div>{project.caption}</div>
      </div>
      <div className="flex items-center gap-2 my-2">
        <audio src={project.song?.fileUrl ?? undefined} controls />
        {project.song?.tabFileUrl && (
          <DownloadForOfflineIcon
            className="cursor-pointer"
            onClick={() => window.open(project.song?.tabFileUrl ?? '', '_blank')}
          />
        )}
      </div>
      {project.song?.lyricsText && (
        <div className="mb-4">
          <Accordion disableGutters defaultExpanded sx={{ border: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Lyrics</AccordionSummary>
            <AccordionDetails>
              <div className="whitespace-pre">{project.song.lyricsText}</div>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
      <div className="flex gap-2 justify-center">
        <Button onClick={onPublish}>Publish</Button>
        <Button color="purple" onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </div>
  </Modal>
);

export default ModalPublish;
