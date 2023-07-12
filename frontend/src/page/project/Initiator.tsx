import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'src/component/Button';
import IcProfile from 'src/image/ic-profile.svg';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import ModalLyrics from './ModalLyrics';
import ModalTrack from './ModalTrack';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const Initiator = ({ project, doRefresh }: Props) => {
  const { id: userId } = useSelector((root: RootState) => root.me);
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState<boolean>(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const ownerCreation = useMemo(
    () => project.collaborators.find((v) => v.role === Role.Owner),
    [project],
  );

  if (!ownerCreation) return <></>;

  return (
    <>
      <div className="font-bold">Initiator</div>
      <div className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4">
        <div className="flex gap-1">
          <img src={IcProfile} />
          <div>{ownerCreation.user.username}</div>
        </div>
        {ownerCreation.track && (
          <div>
            <audio src={ownerCreation.track.fileUrl ?? undefined} controls />
            {ownerCreation.track.tabFileUrl && (
              <div className="border-[1px] border-black w-fit rounded p-1 mt-2">
                <a href={ownerCreation.track.tabFileUrl} target="_blank" rel="noreferrer">
                  download tab
                </a>
              </div>
            )}
            {ownerCreation.user.id === userId && (
              <Button onClick={() => setIsTrackModalOpen(true)}>Update Track</Button>
            )}
          </div>
        )}
        {!ownerCreation.track && ownerCreation.user.id === userId && (
          <Button onClick={() => setIsTrackModalOpen(true)}>Upload Track</Button>
        )}
        {ownerCreation.lyrics && (
          <div>
            <div className="whitespace-pre">{ownerCreation.lyrics.lyricsText}</div>
            {ownerCreation.user.id === userId && (
              <Button onClick={() => setIsLyricsModalOpen(true)}>Update Lyrics</Button>
            )}
          </div>
        )}
        {!ownerCreation.lyrics && ownerCreation.user.id === userId && (
          <Button onClick={() => setIsLyricsModalOpen(true)}>Upload Lyrics</Button>
        )}
      </div>
      <ModalLyrics
        open={isLyricsModalOpen}
        targetLyrics={ownerCreation.lyrics}
        targetProjectId={project.id}
        handleClose={() => setIsLyricsModalOpen(false)}
        doRefresh={doRefresh}
      />
      <ModalTrack
        open={isTrackModalOpen}
        targetTrack={ownerCreation.track}
        targetProjectId={project.id}
        handleClose={() => setIsTrackModalOpen(false)}
        doRefresh={doRefresh}
      />
    </>
  );
};

export default Initiator;
