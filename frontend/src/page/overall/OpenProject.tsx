import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from 'src/component/AudioPlayer';
import { Page } from 'src/constant/Page';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';

type Props = {
  project: DetailedProject;
  className?: string;
};

const OpenProject = ({ project, className }: Props) => {
  const navigate = useNavigate();
  const { id: userId } = useSelector((rootState: RootState) => rootState.me);
  const collaborator = project.collaborators.find((o) => o.user.id === userId);

  return (
    <div
      className={classNames(
        'relative box-border cursor-pointer rounded-md bg-blue/70 bg-center p-4 shadow-md',
        className,
      )}
      style={{
        backgroundImage: project.info.coverFileUrl ? `url(${project.info.coverFileUrl})` : '',
      }}
      onClick={() => navigate(Page.Project, { state: { id: project.id } })}
    >
      <div className="w-fit rounded-lg bg-grey/70 p-2">{project.info.name}</div>
      {collaborator?.track && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <AudioPlayer
            creation={{
              id: project.id,
              info: project.info,
              fileUrl: collaborator.track.fileUrl,
              username:
                project.collaborators.find((o) => o.user.id === userId)?.user.username ?? '',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default OpenProject;
