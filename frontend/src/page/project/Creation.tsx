import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useState } from 'react';
import AudioPlayer from 'src/component/AudioPlayer';
import Button from 'src/component/Button';
import { DetailedCreation, DetailedProject } from 'src/model/backend/Project';
import ModalLyrics from './ModalLyrics';
import ModalTrack from './ModalTrack';

type Props = {
  track: DetailedCreation | null;
  lyrics: DetailedCreation | null;
  isOwner: boolean;
  doRefresh: () => void;
  project: DetailedProject;
  isParticipant?: boolean;
};

const Creation = ({ track, lyrics, isOwner, doRefresh, project, isParticipant = false }: Props) => {
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState<boolean>(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);

  return (
    <>
      {track && (
        <>
          {isParticipant && <div className="mb-2">{track.info.name}</div>}
          <div className="mb-4 flex items-center gap-2">
            {track.fileUrl && (
              <AudioPlayer creation={{ ...track, user: track.user === null ? [] : [track.user] }} />
            )}
            {track.tabFileUrl && (
              <DownloadForOfflineIcon
                className="cursor-pointer"
                onClick={() => window.open(track.tabFileUrl ?? '', '_blank')}
              />
            )}
          </div>
        </>
      )}
      {lyrics && (
        <div className="mb-4">
          <Accordion disableGutters defaultExpanded sx={{ border: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {isParticipant ? lyrics.info.name : 'Lyrics'}
            </AccordionSummary>
            <AccordionDetails>
              <div className="whitespace-pre">{lyrics.lyricsText}</div>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
      {isOwner && (
        <div className="flex justify-center gap-2">
          {track && (
            <Button size="m" color="purple" onClick={() => setIsTrackModalOpen(true)}>
              Update Track
            </Button>
          )}
          {!track && !isParticipant && (
            <Button size="m" color="purple" onClick={() => setIsTrackModalOpen(true)}>
              Upload Track
            </Button>
          )}
          {lyrics && (
            <Button size="m" color="purple" onClick={() => setIsLyricsModalOpen(true)}>
              Update Lyrics
            </Button>
          )}
          {!lyrics && !isParticipant && (
            <Button size="m" color="purple" onClick={() => setIsLyricsModalOpen(true)}>
              Upload Lyrics
            </Button>
          )}
        </div>
      )}
      <ModalLyrics
        open={isLyricsModalOpen}
        targetLyrics={lyrics}
        targetProjectId={project.id}
        handleClose={() => setIsLyricsModalOpen(false)}
        doRefresh={doRefresh}
      />
      <ModalTrack
        open={isTrackModalOpen}
        targetTrack={track}
        targetProjectId={project.id}
        handleClose={() => setIsTrackModalOpen(false)}
        doRefresh={doRefresh}
      />
    </>
  );
};

export default Creation;
