import classNames from 'classnames';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import IcProfile from 'src/image/ic-profile.svg';
import { CombinedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getProject, updateProject } from 'src/service/ProjectService';

const Project = () => {
  const dispatch = useDispatch();
  const state = useLocation().state as { id: string } | null;
  const { userName } = useSelector((rootState: RootState) => rootState.me);
  const [thisProject, setThisProject] = useState<CombinedProject | null>();
  const [mainTrack, setMainTrack] = useState<string>();
  const [mainLyrics, setMainLyrics] = useState<string>();
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
    const ownerTrack = thisProject.track.filter((v) => v.userId === thisProject.userId);
    if (ownerTrack.length > 0 && ownerTrack[0].fileUrl) setMainTrack(ownerTrack[0].fileUrl);

    const ownerLyrics = thisProject.lyrics.filter((v) => v.userId === thisProject.userId);
    if (ownerLyrics.length > 0) setMainLyrics(ownerLyrics[0].lyrics);
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

  if (thisProject === undefined) return <></>;

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
                <div>{thisProject.name}</div>
              )}
            </div>
            <div className="w-1/2">
              {thisProject.coverFileUrl && <img src={thisProject.coverFileUrl} />}
            </div>
          </div>
          <audio src={mainTrack} controls onLoadedMetadata={onLoadMetadata} />
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
            <div
              className="cursor-pointer"
              onClick={() => {
                setIsEdit(!isEdit);
                if (isEdit) onSave();
                else {
                  setEditName(thisProject.name);
                  setEditDescription(thisProject.description);
                  setEditTheme(thisProject.theme);
                  setEditGenre(thisProject.genre);
                  setEditLanguage(thisProject.language);
                  setEditCaption(thisProject.caption);
                }
              }}
            >
              {isEdit ? 'Save' : 'Edit'}
            </div>
          </div>
          <div className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4">
            {tab === 'lyrics' && <div>{mainLyrics}</div>}
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
                    <div>{thisProject.description}</div>
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
                    <div>{thisProject.theme}</div>
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
                    <div>{thisProject.genre}</div>
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
                    <div>{thisProject.language}</div>
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
                    <div>{thisProject.caption}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-1/2">
          <div className="font-bold">Initiator</div>
          <div className="w-fit text-center px-4 py-2 cursor-pointer hover:bg-gray-500">
            <img src={IcProfile} />
            <div>{userName}</div>
          </div>
          <div className="font-bold">Inspired</div>
        </div>
      </div>
    </>
  );
};

export default Project;
