import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'src/component/Button';
import IcProfile from 'src/image/ic-profile.svg';
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
      <div className="font-bold">Partners</div>
      <div className="flex items-end">
        {project.collaborators.map((v) => (
          <div key={v.id} className="w-fit px-4 py-2 flex flex-col items-center text-center">
            {v.role === Role.Owner && <div>Owner</div>}
            <img src={IcProfile} />
            <div>{v.user.username}</div>
            <div>{v.isReady ? 'READY' : 'NOT READY'}</div>
          </div>
        ))}
      </div>
      <Button onClick={onReady}>{user?.isReady ? 'Not Ready' : 'Ready'}</Button>
    </>
  );
};

export default Partners;
