import classNames from 'classnames';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import { Page } from 'src/constant/Page';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { publishProject, updateCover, updateProject } from 'src/service/ProjectService';
import Activities from './Activities';
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

  const mainCreation = useMemo(() => project.mainLyrics || project.mainTrack, [project]);
  const activtiesList = useMemo(() => {
    const res = [...project.inspiration];
    if (project.mainTrack) res.push(project.mainTrack);
    if (project.mainLyrics) res.push(project.mainLyrics);

    return res;
  }, [project]);

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

  const onPublish = (file: File) => {
    if (!mainCreation) return;
    publishProject(project.id, file)
      .then(() => navigate(Page.Explore))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  if (!mainCreation) return <>Loading...</>;

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
                  <div>{mainCreation.name}</div>
                )}
              </div>
              <div
                className={classNames('w-1/2', {
                  'cursor-pointer': mainCreation.userId === userId,
                })}
                onClick={() => coverInputRef.current?.click()}
              >
                {mainCreation.coverFileUrl ? (
                  <img src={mainCreation.coverFileUrl} />
                ) : (
                  <div className="bg-gray-400 h-8" />
                )}
              </div>
            </div>
            <div className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4">
              <div>
                <div className="flex justify-end">
                  {mainCreation.userId === userId && !isEdit && (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setIsEdit(!isEdit);
                        setEditName(mainCreation.name);
                        setEditDescription(mainCreation.description);
                        setEditTheme(mainCreation.theme);
                        setEditGenre(mainCreation.genre);
                        setEditLanguage(mainCreation.language);
                        setEditCaption(mainCreation.caption);
                      }}
                    >
                      Edit
                    </div>
                  )}
                  {mainCreation.userId === userId && isEdit && (
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
                    <div className="whitespace-pre">{mainCreation.description}</div>
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
                    <div>{mainCreation.theme}</div>
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
                    <div>{mainCreation.genre}</div>
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
                    <div>{mainCreation.language}</div>
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
                    <div>{mainCreation.caption}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <Partners creations={activtiesList} />
            <Activities
              mainCreation={mainCreation}
              creations={activtiesList}
              doRefresh={doRefresh}
            />
          </div>
        </div>
        {mainCreation.userId === userId && (
          <div className="text-right mt-4">
            <Button onClick={() => setIsModalOpen(true)}>Publish</Button>
          </div>
        )}
      </div>
      {mainCreation.userId === userId && (
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
        data={{
          coverFileUrl: mainCreation.coverFileUrl,
          name: mainCreation.name,
          description: mainCreation.description,
          theme: mainCreation.theme,
          genre: mainCreation.genre,
          language: mainCreation.language,
          caption: mainCreation.caption,
        }}
      />
    </>
  );
};

export default Collaborate;
