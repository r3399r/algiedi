import { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'src/component/Button';
import { DetailedCreation, DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import ModalLyrics from './ModalLyrics';
import ModalTrack from './ModalTrack';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const Activities = ({ project, doRefresh }: Props) => {
  const { id: userId } = useSelector((root: RootState) => root.me);
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState<boolean>(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const [targetLyrics, setTargetLyrics] = useState<DetailedCreation | null>(null);
  const [targetTrack, setTargetTrack] = useState<DetailedCreation | null>(null);

  const onLoadMetadata = (e: ChangeEvent<HTMLAudioElement>) => {
    console.log(e.target.duration);
  };

  return (
    <>
      <div className="font-bold">Activities</div>
      <div className="pr-4">
        {project.collaborators.map((v) => (
          <div
            key={v.id}
            className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4 mt-2"
          >
            <div>
              <div>Author: {v.user.username}</div>
              <div>Title: {v.track?.name || v.lyrics?.name}</div>
            </div>
            <div>
              {v.track !== null && (
                <div>
                  <audio
                    src={v.track.fileUrl ?? undefined}
                    controls
                    onLoadedMetadata={onLoadMetadata}
                  />
                  {v.track.tabFileUrl && (
                    <div className="border-[1px] border-black w-fit rounded p-1 mt-2">
                      <a href={v.track.tabFileUrl} target="_blank" rel="noreferrer">
                        download tab
                      </a>
                    </div>
                  )}
                  {v.isReady !== true && v.user.id === userId && (
                    <Button
                      onClick={() => {
                        setTargetTrack(v.track);
                        setIsTrackModalOpen(true);
                      }}
                    >
                      Update Track
                    </Button>
                  )}
                </div>
              )}
              {v.lyrics !== null && (
                <div>
                  <div className="whitespace-pre">Lyrics: {v.lyrics.lyricsText}</div>
                  {v.isReady !== true && v.user.id === userId && (
                    <Button
                      onClick={() => {
                        setTargetLyrics(v.lyrics);
                        setIsLyricsModalOpen(true);
                      }}
                    >
                      Update Lyrics
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <ModalLyrics
          open={isLyricsModalOpen}
          targetLyrics={targetLyrics}
          targetProjectId={project.id}
          handleClose={() => setIsLyricsModalOpen(false)}
          doRefresh={doRefresh}
        />
        <ModalTrack
          open={isTrackModalOpen}
          targetTrack={targetTrack}
          targetProjectId={project.id}
          handleClose={() => setIsTrackModalOpen(false)}
          doRefresh={doRefresh}
        />
      </div>
    </>
  );
};

export default Activities;
