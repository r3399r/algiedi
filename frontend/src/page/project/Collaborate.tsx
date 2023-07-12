import classNames from 'classnames';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import { Page } from 'src/constant/Page';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { publishProject, updateCover, updateProject } from 'src/service/ProjectService';
import Activities from './Activities';
import CollaborateMaster from './CollaborateMaster';
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
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editTheme, setEditTheme] = useState<string>('');
  const [editGenre, setEditGenre] = useState<string>('');
  const [editLanguage, setEditLanguage] = useState<string>('');
  const [editCaption, setEditCaption] = useState<string>('');
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

  const onPublish = () => {
    // if (!mainCreation) return;
    publishProject(project.id)
      .then(() => navigate(Page.Explore))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  if (!owner) return <>Loading...</>;

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
                  'cursor-pointer': owner.id === userId,
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
                  {owner.id === userId && !isEdit && (
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
                  {owner.id === userId && isEdit && (
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
      {owner.id === userId && (
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
