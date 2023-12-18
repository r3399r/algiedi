import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import { Playlist } from 'src/model/Playlist';
import { pushPlaylist, setCurrent } from 'src/redux/playlistSlice';
import { RootState } from 'src/redux/store';

type Props = {
  creation: Playlist;
};

const AudioPlayer = ({ creation }: Props) => {
  const { playlist } = useSelector((rootState: RootState) => rootState.playlist);
  const dispatch = useDispatch();

  const onPlay = () => {
    const idx = playlist?.findIndex((v) => v.id === creation.id) ?? -1;
    if (idx < 0) dispatch(pushPlaylist(creation));
    dispatch(setCurrent(idx < 0 ? playlist?.length ?? 0 : idx));
  };

  return (
    <div className="cursor-pointer rounded-xl" onClick={onPlay}>
      <PlayCircleOutlineIcon />
    </div>
  );
};

export default AudioPlayer;
