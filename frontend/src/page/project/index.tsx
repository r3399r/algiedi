import classNames from 'classnames';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import IcProfile from 'src/image/ic-profile.svg';
import { CombinedProject } from 'src/model/backend/Project';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getProject, updateProject } from 'src/service/ProjectService';
import { compare } from 'src/util/compare';

const Project = () => {
  const dispatch = useDispatch();
  const state = useLocation().state as { id: string } | null;
  const [thisProject, setThisProject] = useState<CombinedProject | null>();
  const [mainTrack, setMainTrack] = useState<CombinedProject['track'][0]>();
  const [mainLyrics, setMainLyrics] = useState<CombinedProject['lyrics'][0]>();
  const [inspiredList, setInspiredList] =
    useState<(CombinedProject['lyrics'][0] | CombinedProject['track'][0])[]>();
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

    const track = thisProject.track.find((v) => v.isOriginal);
    if (track) setMainTrack(track);

    const lyrics = thisProject.lyrics.find((v) => v.isOriginal);
    if (lyrics) setMainLyrics(lyrics);

    setInspiredList(
      [
        ...thisProject.lyrics.filter((v) => v.id !== lyrics?.id),
        ...thisProject.track.filter((v) => v.id !== track?.id),
      ].sort(compare('createdAt')),
    );
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
                <div>{mainLyrics?.name ?? mainTrack?.name}</div>
              )}
            </div>
            <div className="w-1/2">
              {mainLyrics?.coverFileUrl && <img src={mainLyrics?.coverFileUrl} />}
              {mainTrack?.coverFileUrl && <img src={mainTrack?.coverFileUrl} />}
            </div>
          </div>
          <audio src={mainTrack?.fileUrl ?? undefined} controls onLoadedMetadata={onLoadMetadata} />
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
                  setEditName(mainLyrics?.name ?? mainTrack?.name ?? '');
                  setEditDescription(mainLyrics?.description ?? mainTrack?.description ?? '');
                  setEditTheme(mainLyrics?.theme ?? mainTrack?.theme ?? '');
                  setEditGenre(mainLyrics?.genre ?? mainTrack?.genre ?? '');
                  setEditLanguage(mainLyrics?.language ?? mainTrack?.language ?? '');
                  setEditCaption(mainLyrics?.caption ?? mainTrack?.caption ?? '');
                }
              }}
            >
              {isEdit ? 'Save' : 'Edit'}
            </div>
          </div>
          <div className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4">
            {tab === 'lyrics' && <div>{mainLyrics?.lyrics}</div>}
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
                    <div>{mainLyrics?.description ?? mainTrack?.description}</div>
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
                    <div>{mainLyrics?.theme ?? mainTrack?.theme}</div>
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
                    <div>{mainLyrics?.genre ?? mainTrack?.genre}</div>
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
                    <div>{mainLyrics?.language ?? mainTrack?.language}</div>
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
                    <div>{mainLyrics?.caption ?? mainTrack?.caption}</div>
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
            <div>{mainLyrics?.username ?? mainTrack?.username}</div>
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
                  <div>{mainLyrics?.username ?? mainTrack?.username}</div>
                  <div>{mainLyrics ? 'The Lyrics' : 'The Audio'}</div>
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
