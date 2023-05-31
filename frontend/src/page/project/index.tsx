import classNames from 'classnames';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Button from 'src/component/Button';
import IcProfile from 'src/image/ic-profile.svg';
import { DetailedCreation, DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getProject, setApproval, updateCover, updateProject } from 'src/service/ProjectService';
import ModalLyrics from './ModalLyrics';
import ModalTrack from './ModalTrack';

const Project = () => {
  const dispatch = useDispatch();
  const state = useLocation().state as { id: string } | null;
  const { id: userId } = useSelector((root: RootState) => root.me);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [thisProject, setThisProject] = useState<DetailedProject | null>();
  const [originalTrack, setOriginalTrack] = useState<DetailedCreation>();
  const [originalLyrics, setOriginalLyrics] = useState<DetailedCreation>();
  const [inspiredList, setInspiredList] = useState<DetailedCreation[]>();
  const [tab, setTab] = useState<'detail' | 'lyrics'>('detail');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editTheme, setEditTheme] = useState<string>('');
  const [editGenre, setEditGenre] = useState<string>('');
  const [editLanguage, setEditLanguage] = useState<string>('');
  const [editCaption, setEditCaption] = useState<string>('');
  const [refresh, setRefresh] = useState<boolean>(false);
  const [targetLyrics, setTargetLyrics] = useState<string>();
  const [targetTrack, setTargetTrack] = useState<string>();

  const mainCreation = useMemo(
    () => originalLyrics || originalTrack,
    [originalLyrics, originalTrack],
  );

  useEffect(() => {
    getProject(state?.id)
      .then((res) => {
        setThisProject(res);
        if (res && res.originalTrack) setOriginalTrack(res.originalTrack);
        if (res && res.originalLyrics) setOriginalLyrics(res.originalLyrics);
        if (res) setInspiredList(res.inspiration);
      })
      .catch((err) => dispatch(openFailSnackbar(err)));
  }, [state?.id, refresh]);

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
      .then(() => setRefresh(!refresh))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  const onApprove = (creationId: string) => () => {
    if (!thisProject) return;
    setApproval(thisProject.id, creationId)
      .then(() => setRefresh(!refresh))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  if (thisProject === null) return <>Please upload a content first.</>;
  if (thisProject === undefined || mainCreation === undefined) return <>Loading...</>;

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
          {originalTrack && (
            <div>
              <audio
                src={originalTrack.fileUrl ?? undefined}
                controls
                onLoadedMetadata={onLoadMetadata}
              />
              {originalTrack.tabFileUrl && (
                <div className="border-[1px] border-black w-fit rounded p-1">
                  <a href={originalTrack.tabFileUrl} target="_blank" rel="noreferrer">
                    download tab
                  </a>
                </div>
              )}
              {mainCreation.userId === userId && (
                <Button className="mt-2" onClick={() => setTargetTrack(originalTrack.id)}>
                  Update Track
                </Button>
              )}
            </div>
          )}
          {!originalTrack && mainCreation.userId === userId && (
            <Button onClick={() => setTargetTrack('new')}>Upload Track</Button>
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
              <div>
                {originalLyrics && (
                  <div>
                    <div className="whitespace-pre">{originalLyrics.lyrics}</div>
                    {mainCreation.userId === userId && (
                      <Button onClick={() => setTargetLyrics(originalLyrics.id)}>
                        Update Lyrics
                      </Button>
                    )}
                  </div>
                )}
                {!originalLyrics && mainCreation.userId === userId && (
                  <Button onClick={() => setTargetLyrics('new')}>Upload Lyrics</Button>
                )}
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
                  <div>
                    <audio
                      src={v.fileUrl ?? undefined}
                      controls
                      onLoadedMetadata={onLoadMetadata}
                    />
                    {v.tabFileUrl && (
                      <div className="border-[1px] border-black w-fit">
                        <a href={v.tabFileUrl} target="_blank" rel="noreferrer">
                          download tab
                        </a>
                      </div>
                    )}
                    {v.approval === false && v.userId === userId && (
                      <Button onClick={() => setTargetTrack(v.id)}>Update Track</Button>
                    )}
                  </div>
                )}
                {v.type === 'lyrics' && (
                  <div>
                    <div className="whitespace-pre">{v.lyrics}</div>
                    {v.approval === false && v.userId === userId && (
                      <Button onClick={() => setTargetLyrics(v.id)}>Update Lyrics</Button>
                    )}
                  </div>
                )}
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
              updateCover(mainCreation.id, e.target.files[0]).then(() => setRefresh(!refresh));
          }}
          ref={coverInputRef}
          className="hidden"
          accept="image/jpeg"
          multiple={false}
        />
      )}
      <ModalLyrics
        open={targetLyrics !== undefined}
        targetLyrics={targetLyrics}
        handleClose={() => setTargetLyrics(undefined)}
        doRefresh={() => setRefresh(!refresh)}
      />
      <ModalTrack
        open={targetTrack !== undefined}
        targetTrack={targetTrack}
        handleClose={() => setTargetTrack(undefined)}
        doRefresh={() => setRefresh(!refresh)}
      />
    </>
  );
};

export default Project;
