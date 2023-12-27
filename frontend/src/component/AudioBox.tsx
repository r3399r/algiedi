import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrent } from 'src/redux/playlistSlice';
import { RootState } from 'src/redux/store';
import Cover from './Cover';

const AudioBox = () => {
  const { playlist, current, isClicked } = useSelector(
    (rootState: RootState) => rootState.playlist,
  );
  const dispatch = useDispatch();
  const [isMinimize, setIsMinimize] = useState<boolean>(false);
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    ref.current?.play();
  }, [isClicked]);

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
    <div className="fixed bottom-0 right-0 z-50 flex items-center gap-2 rounded-xl border border-solid border-black bg-white">
      {!isMinimize && (
        <div className="flex flex-col items-center py-2 pl-2">
          <Cover url={creation?.info.coverFileUrl ?? null} size={70} />
          <div>{creation?.username ?? 'Author'}</div>
        </div>
      )}
      <div className={classNames({ 'relative py-2 pr-2': !isMinimize })}>
        {!isMinimize && (
          <div className="mb-2 ml-4 mr-8 flex items-center justify-between">
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
        )}
        <audio
          src={creation?.fileUrl ?? ''}
          controls
          controlsList="nodownload"
          className={classNames({ hidden: isMinimize })}
          ref={ref}
        />
        <div
          className={classNames('cursor-pointer', {
            static: isMinimize,
            'absolute right-1 top-0': !isMinimize,
          })}
          onClick={() => setIsMinimize(!isMinimize)}
        >
          <CloseFullscreenIcon fontSize="small" />
        </div>
      </div>
    </div>
  );
};

export default AudioBox;
