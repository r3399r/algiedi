import classNames from 'classnames';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import IcProfile from 'src/image/ic-profile.svg';
import { CombinedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getProject } from 'src/service/ProjectService';

const Project = () => {
  const dispatch = useDispatch();
  const state = useLocation().state as { id: string } | null;
  const { userName } = useSelector((rootState: RootState) => rootState.me);
  const [thisProject, setThisProject] = useState<CombinedProject | null>();
  const [mainTrack, setMainTrack] = useState<string>();
  const [mainLyrics, setMainLyrics] = useState<string>();
  const [tab, setTab] = useState<'detail' | 'lyrics'>('detail');

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

  if (thisProject === undefined) return <></>;

  if (thisProject === null) return <>Please upload a content first.</>;

  return (
    <>
      <div className="text-[20px] mb-10">Project</div>
      <div className="bg-[#f2f2f2] rounded-xl p-5 flex gap-10">
        <div className="w-1/2">
          <div className="flex mb-2">
            <div className="w-1/2">{thisProject.name}</div>
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
            <div className="cursor-pointer">Edit</div>
          </div>
          <div className="border-[#707070] bg-white border-[1px] border-solid rounded-[30px] p-4">
            {tab === 'lyrics' && <div>{mainLyrics}</div>}
            {tab === 'detail' && (
              <div>
                <div className="mb-4">{thisProject.description}</div>
                <div>Theme: {thisProject.theme}</div>
                <div>Genre: {thisProject.genre}</div>
                <div>Language: {thisProject.language}</div>
                <div>Caption: {thisProject.caption}</div>
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
