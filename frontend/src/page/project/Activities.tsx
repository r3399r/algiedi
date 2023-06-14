import classNames from 'classnames';
import { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'src/component/Button';
import IcProfile from 'src/image/ic-profile.svg';
import { CollaborateStatus } from 'src/model/backend/constant/Creation';
import { DetailedCreation } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { setApproval } from 'src/service/ProjectService';
import ModalLyrics from './ModalLyrics';
import ModalTrack from './ModalTrack';

type Props = {
  mainCreation: DetailedCreation;
  creations: DetailedCreation[];
  doRefresh: () => void;
};

const Activities = ({ mainCreation, creations, doRefresh }: Props) => {
  const dispatch = useDispatch();
  const { id: userId } = useSelector((root: RootState) => root.me);
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState<boolean>(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const [targetLyrics, setTargetLyrics] = useState<DetailedCreation>();
  const [targetTrack, setTargetTrack] = useState<DetailedCreation>();

  const onLoadMetadata = (e: ChangeEvent<HTMLAudioElement>) => {
    console.log(e.target.duration);
  };

  const onApprove = (creationId: string) => () => {
    setApproval(mainCreation.projectId, creationId)
      .then(doRefresh)
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <>
      <div className="font-bold">Activities</div>
      {creations.map((v) => (
        <div
          key={v.id}
          className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4 mt-2"
        >
          <div className="text-right">
            <button
              className={classNames('border-[1px] rounded-full px-2', {
                'border-green-500 bg-green-500 text-white': v.status === CollaborateStatus.Accepted,
                'border-black': v.status === CollaborateStatus.Proposed,
              })}
              onClick={onApprove(v.id)}
              disabled={mainCreation.userId !== userId}
            >
              v
            </button>
          </div>
          <div>
            <div>{v.username}</div>
            <div>{v.name}</div>
          </div>
          <div>
            {v.type === 'track' && (
              <div>
                <audio src={v.fileUrl ?? undefined} controls onLoadedMetadata={onLoadMetadata} />
                {v.tabFileUrl && (
                  <div className="border-[1px] border-black w-fit rounded p-1 mt-2">
                    <a href={v.tabFileUrl} target="_blank" rel="noreferrer">
                      download tab
                    </a>
                  </div>
                )}
                {v.status === CollaborateStatus.Proposed && v.userId === userId && (
                  <Button
                    onClick={() => {
                      setTargetTrack(v);
                      setIsTrackModalOpen(true);
                    }}
                  >
                    Update Track
                  </Button>
                )}
              </div>
            )}
            {v.type === 'lyrics' && (
              <div>
                <div className="whitespace-pre">{v.lyrics}</div>
                {v.status === CollaborateStatus.Proposed && v.userId === userId && (
                  <Button
                    onClick={() => {
                      setTargetLyrics(v);
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
        targetProjectId={mainCreation.projectId}
        handleClose={() => setIsLyricsModalOpen(false)}
        doRefresh={doRefresh}
      />
      <ModalTrack
        open={isTrackModalOpen}
        targetTrack={targetTrack}
        targetProjectId={mainCreation.projectId}
        handleClose={() => setIsTrackModalOpen(false)}
        doRefresh={doRefresh}
      />
    </>
  );
};

export default Activities;
