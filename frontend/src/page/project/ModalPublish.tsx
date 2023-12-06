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
      <div className="text-xl font-bold">
        Please check the content. Note that this action is irreversible.
      </div>
      <Cover url={project.info.coverFileUrl} />
      <div className="flex gap-2">
        <div className="w-[100px] font-bold">Name</div>
        <div>{project.info.name}</div>
      </div>
      <div className="flex gap-2">
        <div className="w-[100px] font-bold">Description</div>
        <div className="whitespace-pre-line">{project.info.description}</div>
      </div>
      <div className="flex gap-2">
        <div className="w-[100px] font-bold">Theme</div>
        <div>{project.info.theme}</div>
      </div>
      <div className="flex gap-2">
        <div className="w-[100px] font-bold">Genre</div>
        <div>{project.info.genre}</div>
      </div>
      <div className="flex gap-2">
        <div className="w-[100px] font-bold">Language</div>
        <div>{project.info.language}</div>
      </div>
      <div className="my-2 flex items-center gap-2">
        <audio src={project.fileUrl ?? undefined} controls />
        {project.tabFileUrl && (
          <DownloadForOfflineIcon
            className="cursor-pointer"
            onClick={() => window.open(project.tabFileUrl ?? '', '_blank')}
          />
        )}
      </div>
      {project.lyricsText && (
        <div className="mb-4">
          <Accordion disableGutters defaultExpanded sx={{ border: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Lyrics</AccordionSummary>
            <AccordionDetails>
              <div className="whitespace-pre-line">{project.lyricsText}</div>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
      <div className="flex justify-center gap-2">
        <Button onClick={onPublish}>Publish</Button>
        <Button color="purple" onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </div>
  </Modal>
);

export default ModalPublish;
