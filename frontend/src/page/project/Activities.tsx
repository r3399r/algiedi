import { useSelector } from 'react-redux';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import Creation from './Creation';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const Activities = ({ project, doRefresh }: Props) => {
  const { id: userId } = useSelector((root: RootState) => root.me);

  return (
    <>
      <div className="font-bold text-xl">Activities</div>
      <div className="flex flex-col gap-4 mt-2">
        {project.collaborators.map((v) => (
          <div key={v.id} className="border-[#707070] bg-white border border-solid rounded-3xl p-4">
            <div className="font-bold">{v.user.username}</div>
            <Creation
              track={v.track}
              lyrics={v.lyrics}
              isOwner={v.isReady !== true && v.user.id === userId}
              doRefresh={doRefresh}
              project={project}
              isParticipant
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Activities;
