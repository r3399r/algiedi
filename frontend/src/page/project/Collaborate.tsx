import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import { Page } from 'src/constant/Page';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { publishProject } from 'src/service/ProjectService';
import Activities from './Activities';
import CollaborateMaster from './CollaborateMaster';
import Info from './Info';
import ModalPublish from './ModalPublish';
import Partners from './Partners';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const Collaborate = ({ project, doRefresh }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useSelector((root: RootState) => root.me);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const owner = useMemo(
    () => project.collaborators.find((v) => v.role === Role.Owner)?.user,
    [project],
  );
  const canPublish = useMemo(
    () =>
      project.collaborators.length === project.collaborators.filter((v) => v.isReady).length &&
      project.song?.fileUrl !== null &&
      project.song?.lyricsText !== null,
    [project],
  );

  const onPublish = () => {
    publishProject(project.id)
      .then(() => navigate(Page.Explore))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  if (!owner) return <>Loading...</>;

  return (
    <>
      <div className="text-[20px] mb-10">Project</div>
      <div className="bg-[#f2f2f2] rounded-xl p-5">
        <div className="flex gap-4">
          <div className="w-1/2">
            <Info project={project} doRefresh={doRefresh} isOwner={owner.id === userId} />
            <CollaborateMaster project={project} doRefresh={doRefresh} />
          </div>
          <div className="w-1/2">
            <Partners project={project} doRefresh={doRefresh} />
            <Activities project={project} doRefresh={doRefresh} />
          </div>
        </div>
        {owner.id === userId && (
          <div className="text-right mt-4">
            <Button onClick={() => setIsModalOpen(true)} disabled={!canPublish}>
              Publish
            </Button>
          </div>
        )}
      </div>
      <ModalPublish
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        onPublish={onPublish}
        project={project}
      />
    </>
  );
};

export default Collaborate;
