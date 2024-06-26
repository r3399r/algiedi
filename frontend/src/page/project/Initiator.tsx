import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from 'src/component/Avatar';
import { Page } from 'src/constant/Page';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import Creation from './Creation';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const Initiator = ({ project, doRefresh }: Props) => {
  const navigate = useNavigate();
  const { id: userId } = useSelector((root: RootState) => root.me);
  const ownerCreation = useMemo(
    () => project.collaborators.find((v) => v.role === Role.Owner),
    [project],
  );

  if (!ownerCreation) return <></>;

  return (
    <>
      <div className="mb-2 text-xl font-bold">Initiator</div>
      <div className="rounded-2xl border-[1px] border-solid border-[#707070] bg-white p-4">
        <div className="mb-4 flex items-center gap-2">
          <Avatar
            url={ownerCreation.user.avatarUrl}
            size={80}
            clickable
            onClick={() => navigate(`${Page.Explore}/user/${ownerCreation.user.id}`)}
          />
          <div>{ownerCreation.user.username}</div>
        </div>
        <Creation
          track={ownerCreation.track}
          lyrics={ownerCreation.lyrics}
          updatable={ownerCreation.user.id === userId}
          doRefresh={doRefresh}
          project={project}
        />
      </div>
    </>
  );
};

export default Initiator;
