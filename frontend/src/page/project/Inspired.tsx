import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from 'src/component/Avatar';
import { Page } from 'src/constant/Page';
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
  const navigate = useNavigate();
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
        <div className="text-xl font-bold">Inspired</div>
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
          className="mt-2 rounded-3xl border-[1px] border-solid border-[#707070] bg-white p-4"
        >
          <div className="text-right">
            <button onClick={onApprove(v.user.id)} disabled={ownerCreation?.user.id !== userId}>
              {v.isAccepted ? (
                <CheckCircleIcon className="text-green" />
              ) : (
                <CheckCircleOutlineIcon />
              )}
            </button>
          </div>
          <div className="mb-4 flex items-center gap-2">
            <Avatar
              url={v.user.avatarUrl}
              size={80}
              clickable
              onClick={() => navigate(`${Page.Explore}/user/${v.user.id}`)}
            />
            <div>{v.user.username}</div>
          </div>
          <Creation
            track={v.track}
            lyrics={v.lyrics}
            updatable={v.user.id === userId}
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
