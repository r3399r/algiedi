import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'src/component/Button';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import ModalMaster from './ModalMaster';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const CollaborateMaster = ({ project, doRefresh }: Props) => {
  const { id: userId } = useSelector((root: RootState) => root.me);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const masterCreation = useMemo(() => project.song, [project]);
  const owner = useMemo(
    () => project.collaborators.find((v) => v.role === Role.Owner)?.user,
    [project],
  );
  const isUpdate = useMemo(
    () => masterCreation?.fileUrl || masterCreation?.lyricsText,
    [masterCreation],
  );

  if (!owner) return <></>;

  return (
    <>
      <div className="font-bold">Master Creation</div>
      <div className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4">
        {isUpdate && (
          <div>
            {masterCreation?.fileUrl && <audio src={masterCreation.fileUrl} controls />}
            {masterCreation?.tabFileUrl && (
              <div className="border-[1px] border-black w-fit rounded p-1 mt-2">
                <a href={masterCreation.tabFileUrl} target="_blank" rel="noreferrer">
                  download tab
                </a>
              </div>
            )}
            {masterCreation?.lyricsText && (
              <div className="whitespace-pre">{masterCreation.lyricsText}</div>
            )}
            {owner.id === userId && (
              <Button onClick={() => setIsModalOpen(true)}>Update Creation</Button>
            )}
          </div>
        )}
        {!isUpdate && owner.id === userId && (
          <Button onClick={() => setIsModalOpen(true)}>Upload Creation</Button>
        )}
      </div>
      <ModalMaster
        open={isModalOpen}
        targetCreation={masterCreation}
        targetProjectId={project.id}
        handleClose={() => setIsModalOpen(false)}
        doRefresh={doRefresh}
      />
    </>
  );
};

export default CollaborateMaster;
