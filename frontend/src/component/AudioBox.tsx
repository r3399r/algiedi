import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrent } from 'src/redux/playlistSlice';
import { RootState } from 'src/redux/store';
import Cover from './Cover';

const AudioBox = () => {
  const { playlist, current } = useSelector((rootState: RootState) => rootState.playlist);
  const dispatch = useDispatch();

  const creation = useMemo(() => {
    if (playlist === null || current === null || current < 0) return null;

    return playlist[current];
  }, [playlist, current]);

  const onNext = () => {
    if (playlist === null || current === null || current < 0 || playlist.length - 1 === current)
      return;
    dispatch(setCurrent(current + 1));
  };

  const onPrev = () => {
    if (playlist === null || current === null || current <= 0) return;
    dispatch(setCurrent(current - 1));
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 flex items-center gap-2 rounded-xl border border-solid border-black bg-white p-2">
      <div className="flex flex-col items-center">
        <Cover url={creation?.info.coverFileUrl ?? null} size={70} />
        <div>{creation?.owner.username ?? 'Author'}</div>
      </div>
      <div>
        <div className="mx-4 mb-2 flex items-center justify-between">
          <div>{creation?.info.name ?? 'Title'}</div>
          <div className="flex gap-1">
            <div
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-solid border-black bg-black"
              onClick={onPrev}
            >
              <FastRewindIcon className="text-white" />
            </div>
            <div
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-solid border-black bg-black"
              onClick={onNext}
            >
              <FastForwardIcon className="text-white" />
            </div>
          </div>
        </div>
        <audio src={creation?.fileUrl ?? ''} controls autoPlay />
      </div>
    </div>
  );
};

export default AudioBox;
