import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'src/component/Avatar';
import Button from 'src/component/Button';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { setReady } from 'src/service/ProjectService';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const Partners = ({ project, doRefresh }: Props) => {
  const dispatch = useDispatch();
  const { id: userId } = useSelector((root: RootState) => root.me);
  const user = useMemo(() => project.collaborators.find((v) => v.user.id === userId), [project]);

  const onReady = () => {
    setReady(project.id)
      .then(doRefresh)
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Partners</div>
        <Button size="m" color="transparent" onClick={onReady}>
          {user?.isReady ? 'Need more work' : 'Ready'}
        </Button>
      </div>
      <div className="flex flex-wrap items-end">
        {project.collaborators.map((v) => (
          <div key={v.id} className="flex w-fit flex-col items-center px-4 py-2 text-center">
            {v.role === Role.Owner && <StarBorderIcon />}
            <Avatar url={v.user.avatarUrl} size={80} />
            <div>{v.user.username}</div>
            <div>
              {v.isReady ? (
                <CheckCircleIcon color="primary" classes={{ colorPrimary: '!text-green' }} />
              ) : (
                <CheckCircleOutlineIcon />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Partners;
