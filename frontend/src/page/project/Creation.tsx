import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
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
          <div className="text-right text-sm">
            {track.createdAt ? formatDistanceToNow(new Date(track.createdAt)) : ''}
          </div>
          {isParticipant && (
            <div className="mb-2 flex items-center gap-1">
              <MusicNoteIcon
                color="primary"
                classes={{ colorPrimary: '!text-blue' }}
                fontSize="small"
              />
              <div>{track.info.name}</div>
            </div>
          )}
          <div className="mb-4 flex items-center gap-2">
            {track.fileUrl && track.user && (
              <AudioPlayer creation={{ ...track, owner: track.user }} />
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
          <div className="text-right text-sm">
            {lyrics.createdAt ? formatDistanceToNow(new Date(lyrics.createdAt)) : ''}
          </div>
          <Accordion disableGutters defaultExpanded sx={{ border: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="flex items-center gap-1">
                <HistoryEduIcon
                  color="primary"
                  classes={{ colorPrimary: '!text-red' }}
                  fontSize="small"
                />
                {isParticipant ? lyrics.info.name : 'Lyrics'}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="whitespace-pre-line">{lyrics.lyricsText}</div>
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
