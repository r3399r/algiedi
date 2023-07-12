import classNames from 'classnames';
import { ChangeEvent, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'src/component/Button';
import IcProfile from 'src/image/ic-profile.svg';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedCreation, DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { setApproval } from 'src/service/ProjectService';
import ModalLyrics from './ModalLyrics';
import ModalTrack from './ModalTrack';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const Inspired = ({ project, doRefresh }: Props) => {
  const dispatch = useDispatch();
  const { id: userId } = useSelector((root: RootState) => root.me);
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState<boolean>(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const [targetLyrics, setTargetLyrics] = useState<DetailedCreation | null>(null);
  const [targetTrack, setTargetTrack] = useState<DetailedCreation | null>(null);

  const inspiration = useMemo(
    () => project.collaborators.filter((v) => v.role !== Role.Owner),
    [project],
  );
  const ownerCreation = useMemo(
    () => project.collaborators.find((v) => v.role === Role.Owner),
    [project],
  );

  const onLoadMetadata = (e: ChangeEvent<HTMLAudioElement>) => {
    console.log(e.target.duration);
  };

  const onApprove = (creationId: string) => () => {
    setApproval(project.id, creationId)
      .then(doRefresh)
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="font-bold">Inspired</div>
        <div className="flex gap-2">
          <div>
            Audio {inspiration.filter((v) => v.track !== null && v.isAccepted === true).length}/
            {inspiration.filter((v) => v.track !== null).length}
          </div>
          <div>
            Lyrics {inspiration.filter((v) => v.lyrics !== null && v.isAccepted === true).length}/
            {inspiration.filter((v) => v.lyrics !== null).length}
          </div>
        </div>
      </div>
      {inspiration.map((v) => (
        <div
          key={v.id}
          className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4 mt-2"
        >
          <div className="text-right">
            <button
              className={classNames('border-[1px] rounded-full px-2', {
                'border-green-500 bg-green-500 text-white': v.isAccepted === true,
                'border-black': v.isAccepted !== true,
              })}
              onClick={onApprove(v.user.id)}
              disabled={ownerCreation?.user.id !== userId}
            >
              v
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <img src={IcProfile} />
            <div>
              <div>{v.user.username}</div>
              <div>{v.track?.name || v.lyrics?.name}</div>
            </div>
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
                {v.isAccepted !== true && v.user.id === userId && (
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
                <div className="whitespace-pre">{v.lyrics.lyricsText}</div>
                {v.isAccepted !== true && v.user.id === userId && (
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
    </>
  );
};

export default Inspired;
