import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import IcProfile from 'src/image/ic-profile.svg';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import Creation from './Creation';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const Initiator = ({ project, doRefresh }: Props) => {
  const { id: userId } = useSelector((root: RootState) => root.me);
  const ownerCreation = useMemo(
    () => project.collaborators.find((v) => v.role === Role.Owner),
    [project],
  );

  if (!ownerCreation) return <></>;

  return (
    <>
      <div className="font-bold mb-2 text-xl">Initiator</div>
      <div className="border-[#707070] bg-white border-[1px] border-solid rounded-2xl p-4">
        <div className="flex gap-2 items-center mb-4">
          <img src={IcProfile} />
          <div>{ownerCreation.user.username}</div>
        </div>
        <Creation
          track={ownerCreation.track}
          lyrics={ownerCreation.lyrics}
          isOwner={ownerCreation.user.id === userId}
          doRefresh={doRefresh}
          project={project}
        />
      </div>
    </>
  );
};

export default Initiator;
