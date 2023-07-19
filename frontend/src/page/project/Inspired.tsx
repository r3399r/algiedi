import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IcProfile from 'src/image/ic-profile.svg';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { setApproval } from 'src/service/ProjectService';
import Creation from './Creation';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const Inspired = ({ project, doRefresh }: Props) => {
  const dispatch = useDispatch();
  const { id: userId } = useSelector((root: RootState) => root.me);

  const inspiration = useMemo(
    () => project.collaborators.filter((v) => v.role !== Role.Owner),
    [project],
  );
  const ownerCreation = useMemo(
    () => project.collaborators.find((v) => v.role === Role.Owner),
    [project],
  );

  const onApprove = (creationId: string) => () => {
    setApproval(project.id, creationId)
      .then(doRefresh)
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="font-bold text-xl">Inspired</div>
        <div className="flex gap-2 text-sm text-grey">
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
          className="border-[#707070] bg-white border-[1px] border-solid rounded-3xl p-4 mt-2"
        >
          <div className="text-right">
            <button onClick={onApprove(v.user.id)} disabled={ownerCreation?.user.id !== userId}>
              {v.isAccepted ? (
                <CheckCircleIcon color="primary" classes={{ colorPrimary: '!text-green' }} />
              ) : (
                <CancelIcon color="primary" classes={{ colorPrimary: '!text-red' }} />
              )}
            </button>
          </div>
          <div className="flex gap-2 items-center mb-4">
            <img src={IcProfile} />
            <div>{v.user.username}</div>
          </div>
          <Creation
            track={v.track}
            lyrics={v.lyrics}
            isOwner={v.user.id === userId}
            doRefresh={doRefresh}
            project={project}
            isParticipant
          />
        </div>
      ))}
    </>
  );
};

export default Inspired;
