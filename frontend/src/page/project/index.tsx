import classNames from 'classnames';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import IcProfile from 'src/image/ic-profile.svg';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getProject, updateProject } from 'src/service/ProjectService';

const Project = () => {
  const dispatch = useDispatch();
  const state = useLocation().state as { id: string } | null;
  const { sub: userId } = useSelector((root: RootState) => root.me);
  const [thisProject, setThisProject] = useState<DetailedProject | null>();
  const [mainCreation, setMainCreation] = useState<DetailedProject['creation'][0]>();
  const [inspiredList, setInspiredList] = useState<DetailedProject['creation']>();
  const [tab, setTab] = useState<'detail' | 'lyrics'>('detail');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editTheme, setEditTheme] = useState<string>('');
  const [editGenre, setEditGenre] = useState<string>('');
  const [editLanguage, setEditLanguage] = useState<string>('');
  const [editCaption, setEditCaption] = useState<string>('');

  useEffect(() => {
    getProject(state?.id)
      .then((res) => setThisProject(res))
      .catch((err) => dispatch(openFailSnackbar(err)));
  }, [state?.id]);

  useEffect(() => {
    if (!thisProject) return;

    const main = thisProject.creation.find((v) => v.isOriginal);
    setMainCreation(main);

    setInspiredList(thisProject.creation.filter((v) => v.id !== main?.id));
  }, [thisProject]);

  const onLoadMetadata = (e: ChangeEvent<HTMLAudioElement>) => {
    console.log(e.target.duration);
  };

  const onSave = () => {
    if (!thisProject) return;
    updateProject(thisProject.id, {
      name: editName,
      description: editDescription,
      theme: editTheme,
      genre: editGenre,
      language: editLanguage,
      caption: editCaption,
    })
      .then((res) => {
        if (res) setThisProject(res);
      })
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  if (thisProject === undefined || mainCreation === undefined) return <></>;

  if (thisProject === null) return <>Please upload a content first.</>;

  return (
    <>
      <div className="text-[20px] mb-10">Project</div>
      <div className="bg-[#f2f2f2] rounded-xl p-5 flex gap-10">
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
            <div className="w-1/2">
              {mainCreation.coverFileUrl && <img src={mainCreation.coverFileUrl} />}
            </div>
          </div>
          {mainCreation.type === 'track' && (
            <audio
              src={mainCreation.fileUrl ?? undefined}
              controls
              onLoadedMetadata={onLoadMetadata}
            />
          )}
          <div className="flex justify-between mt-4">
            <div className="flex gap-4 mb-6">
              <div
                className={classNames('cursor-pointer', {
                  'text-[#4346e1] border-b-[1px] border-b-[#4346e1]': tab === 'lyrics',
                })}
                onClick={() => setTab('lyrics')}
              >
                Lyrics
              </div>
              <div
                className={classNames('cursor-pointer', {
                  'text-[#4346e1] border-b-[1px] border-b-[#4346e1]': tab === 'detail',
                })}
                onClick={() => setTab('detail')}
              >
                Detail
              </div>
            </div>
            {mainCreation.userId === userId && (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setIsEdit(!isEdit);
                  if (isEdit) onSave();
                  else {
                    setEditName(mainCreation.name);
                    setEditDescription(mainCreation.description);
                    setEditTheme(mainCreation.theme);
                    setEditGenre(mainCreation.genre);
                    setEditLanguage(mainCreation.language);
                    setEditCaption(mainCreation.caption);
                  }
                }}
              >
                {isEdit ? 'Save' : 'Edit'}
              </div>
            )}
          </div>
          <div className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4">
            {tab === 'lyrics' && <div>{mainCreation.type === 'lyrics' && mainCreation.lyrics}</div>}
            {tab === 'detail' && (
              <div>
                <div className="mb-4">
                  {isEdit ? (
                    <textarea
                      className="w-full border-[1px] border-black px-2 rounded"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  ) : (
                    <div>{mainCreation.description}</div>
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
            )}
          </div>
        </div>
        <div className="w-1/2">
          <div className="font-bold">Initiator</div>
          <div className="w-fit text-center px-4 py-2">
            <img src={IcProfile} />
            <div>{mainCreation.username}</div>
          </div>
          <div className="font-bold">Inspired</div>
          {inspiredList?.map((v) => (
            <div
              key={v.id}
              className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4 mt-2"
            >
              <div className="flex gap-2 items-center">
                <img src={IcProfile} />
                <div>
                  <div>{v.username}</div>
                  <div>{v.type === 'lyrics' ? 'The Lyrics' : 'The Audio'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Project;
