import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'src/component/Button';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import ModalMaster from './ModalMaster';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const CollaborateMaster = ({ project, doRefresh }: Props) => {
  const { id: userId } = useSelector((root: RootState) => root.me);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const owner = useMemo(
    () => project.collaborators.find((v) => v.role === Role.Owner)?.user,
    [project],
  );
  const hasUploaded = useMemo(() => project?.fileUrl || project?.lyricsText, [project]);

  if (!owner) return <></>;

  return (
    <>
      <div className="text-xl font-bold">Master Creation</div>
      <div className="rounded-3xl border-[1px] border-solid border-[#707070] bg-white p-4">
        {hasUploaded && (
          <>
            <div className="mb-4 flex items-center gap-2">
              {project.fileUrl && <audio src={project.fileUrl} controls />}
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
                    <div className="whitespace-pre">{project.lyricsText}</div>
                  </AccordionDetails>
                </Accordion>
              </div>
            )}
          </>
        )}
        {owner.id === userId && (
          <div className="text-center">
            <Button size="m" color="purple" onClick={() => setIsModalOpen(true)}>
              {hasUploaded ? 'Update Creation' : 'Upload Creation'}
            </Button>
          </div>
        )}
        {!hasUploaded && owner.id !== userId && (
          <div className="text-center">{`${owner.username} has not uploaded files yet.`}</div>
        )}
      </div>
      <ModalMaster
        open={isModalOpen}
        targetCreation={project}
        // targetProjectId={masterCreation.id}
        handleClose={() => setIsModalOpen(false)}
        doRefresh={doRefresh}
      />
    </>
  );
};

export default CollaborateMaster;
