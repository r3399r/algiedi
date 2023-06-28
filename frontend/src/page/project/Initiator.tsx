import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'src/component/Button';
import IcProfile from 'src/image/ic-profile.svg';
import { DetailedCreation } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import ModalLyrics from './ModalLyrics';
import ModalTrack from './ModalTrack';

type Props = {
  track?: DetailedCreation;
  lyrics?: DetailedCreation;
  doRefresh: () => void;
};

const Initiator = ({ track, lyrics, doRefresh }: Props) => {
  const { id: userId } = useSelector((root: RootState) => root.me);
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState<boolean>(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const creation = useMemo(() => track || lyrics, [track, lyrics]);

  if (!creation) return <></>;

  return (
    <>
      <div className="font-bold">Initiator</div>
      <div className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4">
        <div className="flex gap-1">
          <img src={IcProfile} />
          <div>{creation.username}</div>
        </div>
        {track && (
          <div>
            <audio src={track.fileUrl ?? undefined} controls />
            {track.tabFileUrl && (
              <div className="border-[1px] border-black w-fit rounded p-1 mt-2">
                <a href={track.tabFileUrl} target="_blank" rel="noreferrer">
                  download tab
                </a>
              </div>
            )}
            {track.userId === userId && (
              <Button onClick={() => setIsTrackModalOpen(true)}>Update Track</Button>
            )}
          </div>
        )}
        {!track && creation.userId === userId && (
          <Button onClick={() => setIsTrackModalOpen(true)}>Upload Track</Button>
        )}
        {lyrics && (
          <div>
            <div className="whitespace-pre">{lyrics.lyrics}</div>
            {lyrics.userId === userId && (
              <Button onClick={() => setIsLyricsModalOpen(true)}>Update Lyrics</Button>
            )}
          </div>
        )}
        {!lyrics && creation.userId === userId && (
          <Button onClick={() => setIsLyricsModalOpen(true)}>Upload Lyrics</Button>
        )}
      </div>
      <ModalLyrics
        open={isLyricsModalOpen}
        targetLyrics={lyrics}
        targetProjectId={creation.projectId}
        handleClose={() => setIsLyricsModalOpen(false)}
        doRefresh={doRefresh}
      />
      <ModalTrack
        open={isTrackModalOpen}
        targetTrack={track}
        targetProjectId={creation.projectId}
        handleClose={() => setIsTrackModalOpen(false)}
        doRefresh={doRefresh}
      />
    </>
  );
};

export default Initiator;
