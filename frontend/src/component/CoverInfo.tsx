import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { MouseEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePlayer from 'src/hook/usePlayer';
import { Type } from 'src/model/backend/constant/Creation';
import { ExploreCreation } from 'src/model/backend/Explore';
import { bn } from 'src/util/bignumber';
import Cover from './Cover';
import UserMenu from './UserMenu';

type Props = {
  creation: ExploreCreation;
  size?: number;
  navigateTo?: string;
  showCount?: boolean;
};

const CoverInfo = ({ creation, size, navigateTo, showCount = false }: Props) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const onPlay = usePlayer();
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      className="flex cursor-pointer flex-col items-center text-center"
      onClick={() => {
        if (navigateTo) navigate(navigateTo);
      }}
    >
      <div
        className="relative"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Cover url={creation.info.coverFileUrl} size={size} />
        {creation.type !== Type.Lyrics && isHover && (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
              if (creation.user.length > 0) {
                e.stopPropagation();
                onPlay({
                  id: creation.id,
                  info: creation.info,
                  fileUrl: creation.fileUrl,
                  username: creation.user[0].username,
                });
              }
            }}
          >
            <PlayArrowIcon className="text-white" />
          </div>
        )}
      </div>
      <div className="flex items-center">
        {creation.type === Type.Track && <MusicNoteIcon className="text-blue" fontSize="small" />}
        {creation.type === Type.Lyrics && <HistoryEduIcon className="text-red" fontSize="small" />}
        {creation.type === Type.Song && <StarBorderIcon fontSize="small" />}
        <div className="font-bold">{creation.info.name}</div>
      </div>
      {creation.user && (
        <div
          className="text-sm text-grey hover:text-blue"
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          ref={ref}
        >{`${creation.user.length > 0 ? creation.user[0].username : ''}${
          creation.user.length > 1 ? ` & ${creation.user.length - 1} others` : ''
        }`}</div>
      )}
      {showCount && (
        <div className="flex items-center gap-2">
          <PlayArrowIcon />
          <div>{bn(creation.countView).toFormat()}</div>
          <FavoriteIcon className="text-red" />
          <div>{bn(creation.countLike).toFormat()}</div>
        </div>
      )}
      {creation.user && (
        <UserMenu
          open={menuOpen}
          anchorEl={ref.current}
          onClose={() => setMenuOpen(false)}
          author={creation.user}
        />
      )}
    </div>
  );
};

export default CoverInfo;
