import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import usePlayer from 'src/hook/usePlayer';
import { Playlist } from 'src/model/Playlist';

type Props = {
  creation: Playlist;
};

const AudioPlayer = ({ creation }: Props) => {
  const onPlay = usePlayer();

  return (
    <div
      className="cursor-pointer rounded-full bg-red px-1 pb-1 pt-0.5"
      onClick={() => onPlay(creation)}
    >
      <PlayArrowIcon className="text-white" />
    </div>
  );
};

export default AudioPlayer;
