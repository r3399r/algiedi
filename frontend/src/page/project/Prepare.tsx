import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'src/component/Button';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { startProject } from 'src/service/ProjectService';
import Info from './Info';
import Initiator from './Initiator';
import Inspired from './Inspired';
import ModalStart from './ModalStart';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const Prepare = ({ project, doRefresh }: Props) => {
  const dispatch = useDispatch();
  const { id: userId } = useSelector((root: RootState) => root.me);
  const { isProjectInfoEdit } = useSelector((root: RootState) => root.ui);
  const [isStartModalOpen, setIsStartModalOpen] = useState<boolean>(false);

  const ownerCreation = useMemo(
    () => project.collaborators.find((v) => v.role === Role.Owner),
    [project],
  );

  const onStart = () => {
    startProject(project.id)
      .then(() => {
        setIsStartModalOpen(false);
        doRefresh();
      })
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  if (ownerCreation === undefined) return <></>;

  return (
    <>
      <div className="mb-10 text-[20px]">Latest Project</div>
      <div className="rounded-xl bg-[#f2f2f2] p-5">
        <div className="flex gap-4">
          <div className="w-1/2">
            <Info
              project={project}
              doRefresh={doRefresh}
              isOwner={ownerCreation.user.id === userId}
            />
            <Initiator project={project} doRefresh={doRefresh} />
          </div>
          <div className="w-1/2">
            <Inspired project={project} doRefresh={doRefresh} />
          </div>
        </div>
        {ownerCreation.user.id === userId && (
          <div className="mt-4 text-right">
            <Button onClick={() => setIsStartModalOpen(true)} disabled={isProjectInfoEdit}>
              Start Project
            </Button>
          </div>
        )}
      </div>
      <ModalStart
        open={isStartModalOpen}
        handleClose={() => setIsStartModalOpen(false)}
        onStart={onStart}
      />
    </>
  );
};

export default Prepare;
