import classNames from 'classnames';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import IcProfile from 'src/image/ic-profile.svg';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getProject, setApproval, updateCover, updateProject } from 'src/service/ProjectService';

const Project = () => {
  const dispatch = useDispatch();
  const state = useLocation().state as { id: string } | null;
  const { id: userId } = useSelector((root: RootState) => root.me);
  const coverInputRef = useRef<HTMLInputElement>(null);
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

  const onApprove = (creationId: string) => () => {
    if (!thisProject) return;
    setApproval(thisProject.id, creationId)
      .then((res) => {
        if (res) setThisProject(res);
      })
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  if (thisProject === null) return <>Please upload a content first.</>;
  if (thisProject === undefined || mainCreation === undefined) return <></>;

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
            <div
              className={classNames('w-1/2', { 'cursor-pointer': mainCreation.userId === userId })}
              onClick={() => coverInputRef.current?.click()}
            >
              {mainCreation.coverFileUrl ? (
                <img src={mainCreation.coverFileUrl} />
              ) : (
                <div className="bg-gray-400 h-8" />
              )}
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
          <div className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4">
            {tab === 'lyrics' && (
              <div className="whitespace-pre">
                {mainCreation.type === 'lyrics' && mainCreation.lyrics}
              </div>
            )}
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
          <div className="flex justify-between">
            <div className="font-bold">Inspired</div>
            <div className="flex gap-2">
              <div>
                Audio{' '}
                {inspiredList?.filter((v) => v.type === 'track' && v.approval === true).length}/
                {inspiredList?.filter((v) => v.type === 'track').length}
              </div>
              <div>
                Lyrics{' '}
                {inspiredList?.filter((v) => v.type === 'lyrics' && v.approval === true).length}/
                {inspiredList?.filter((v) => v.type === 'lyrics').length}
              </div>
            </div>
          </div>
          {inspiredList?.map((v) => (
            <div
              key={v.id}
              className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4 mt-2"
            >
              <div className="text-right">
                <button
                  className={classNames('border-[1px] rounded-full px-2', {
                    'border-green-500 bg-green-500 text-white': v.approval === true,
                    'border-black': v.approval === false,
                  })}
                  onClick={onApprove(v.id)}
                  disabled={mainCreation.userId !== userId}
                >
                  v
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <img src={IcProfile} />
                <div>
                  <div>{v.username}</div>
                  <div>{v.name}</div>
                </div>
              </div>
              <div>
                {v.type === 'track' && (
                  <audio src={v.fileUrl ?? undefined} controls onLoadedMetadata={onLoadMetadata} />
                )}
                {v.type === 'lyrics' && <div className="whitespace-pre">{v.lyrics}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {mainCreation.userId === userId && (
        <input
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length === 1)
              updateCover(mainCreation.id, e.target.files[0]);
          }}
          ref={coverInputRef}
          className="hidden"
          accept="image/jpeg"
          multiple={false}
        />
      )}
    </>
  );
};

export default Project;
