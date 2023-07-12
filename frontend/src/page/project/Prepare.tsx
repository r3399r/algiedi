import classNames from 'classnames';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'src/component/Button';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { startProject, updateCover, updateProject } from 'src/service/ProjectService';
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
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editTheme, setEditTheme] = useState<string>('');
  const [editGenre, setEditGenre] = useState<string>('');
  const [editLanguage, setEditLanguage] = useState<string>('');
  const [editCaption, setEditCaption] = useState<string>('');
  const [isStartModalOpen, setIsStartModalOpen] = useState<boolean>(false);

  const ownerCreation = useMemo(
    () => project.collaborators.find((v) => v.role === Role.Owner),
    [project],
  );

  const onSave = () => {
    updateProject(project.id, {
      name: editName,
      description: editDescription,
      theme: editTheme,
      genre: editGenre,
      language: editLanguage,
      caption: editCaption,
    })
      .then(doRefresh)
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

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
      <div className="text-[20px] mb-10">Project</div>
      <div className="bg-[#f2f2f2] rounded-xl p-5">
        <div className="flex gap-10">
          <div className="w-1/2">
            <div className="flex mb-2">
              <div className="w-1/2">
                {isEdit ? (
                  <input
                    className="w-full border-[1px] border-black px-2 rounded"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  <div>{project.name}</div>
                )}
              </div>
              <div
                className={classNames('w-1/2', {
                  'cursor-pointer': ownerCreation.user.id === userId,
                })}
                onClick={() => coverInputRef.current?.click()}
              >
                {project.coverFileUrl ? (
                  <img src={project.coverFileUrl} />
                ) : (
                  <div className="bg-gray-400 h-8" />
                )}
              </div>
            </div>
            <div className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4">
              <div>
                <div className="flex justify-end">
                  {ownerCreation.user.id === userId && !isEdit && (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setIsEdit(!isEdit);
                        setEditName(project.name ?? '');
                        setEditDescription(project.description ?? '');
                        setEditTheme(project.theme ?? '');
                        setEditGenre(project.genre ?? '');
                        setEditLanguage(project.language ?? '');
                        setEditCaption(project.caption ?? '');
                      }}
                    >
                      Edit
                    </div>
                  )}
                  {ownerCreation.user.id === userId && isEdit && (
                    <div className="flex gap-2">
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setIsEdit(!isEdit);
                        }}
                      >
                        Cancel
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setIsEdit(!isEdit);
                          onSave();
                        }}
                      >
                        Save
                      </div>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  {isEdit ? (
                    <textarea
                      className="w-full border-[1px] border-black px-2 rounded"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  ) : (
                    <div className="whitespace-pre">{project.description}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div>Theme:</div>
                  {isEdit ? (
                    <input
                      className="w-full border-[1px] border-black px-2 rounded"
                      value={editTheme}
                      onChange={(e) => setEditTheme(e.target.value)}
                    />
                  ) : (
                    <div>{project.theme}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div>Genre:</div>
                  {isEdit ? (
                    <input
                      className="w-full border-[1px] border-black px-2 rounded"
                      value={editGenre}
                      onChange={(e) => setEditGenre(e.target.value)}
                    />
                  ) : (
                    <div>{project.genre}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div>Language:</div>
                  {isEdit ? (
                    <input
                      className="w-full border-[1px] border-black px-2 rounded"
                      value={editLanguage}
                      onChange={(e) => setEditLanguage(e.target.value)}
                    />
                  ) : (
                    <div>{project.language}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div>Caption:</div>
                  {isEdit ? (
                    <input
                      className="w-full border-[1px] border-black px-2 rounded"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                    />
                  ) : (
                    <div>{project.caption}</div>
                  )}
                </div>
              </div>
            </div>
            <Initiator project={project} doRefresh={doRefresh} />
          </div>
          <div className="w-1/2">
            <Inspired project={project} doRefresh={doRefresh} />
          </div>
        </div>
        {ownerCreation.user.id === userId && (
          <div className="text-right mt-4">
            <Button onClick={() => setIsStartModalOpen(true)}>Start Project</Button>
          </div>
        )}
      </div>
      {ownerCreation.user.id === userId && (
        <input
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length === 1)
              updateCover(project, e.target.files[0]).then(doRefresh);
          }}
          ref={coverInputRef}
          className="hidden"
          accept="image/jpeg"
          multiple={false}
        />
      )}
      <ModalStart
        open={isStartModalOpen}
        handleClose={() => setIsStartModalOpen(false)}
        onStart={onStart}
      />
    </>
  );
};

export default Prepare;
