import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { MouseEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePlayer from 'src/hook/usePlayer';
import { Type } from 'src/model/backend/constant/Creation';
import { ExploreCreation } from 'src/model/backend/Explore';
import Cover from './Cover';
import UserMenu from './UserMenu';

type Props = {
  creation: ExploreCreation;
  size?: number;
  navigateTo?: string;
};

const CoverInfo = ({ creation, size, navigateTo }: Props) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const onPlay = usePlayer();

  return (
    <div
      className="flex cursor-pointer flex-col items-center text-center"
      onClick={() => {
        if (navigateTo) navigate(navigateTo);
      }}
    >
      <div
        className="relative"
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          if (creation.type !== Type.Lyrics && creation.user.length > 0) {
            e.stopPropagation();
            onPlay({
              id: creation.id,
              info: creation.info,
              fileUrl: creation.fileUrl,
              owner: creation.user[0],
            });
          }
        }}
      >
        <Cover url={creation.info.coverFileUrl} size={size} />
        {creation.type !== Type.Lyrics && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <PlayArrowIcon className="text-white" fontSize="large" />
          </div>
        )}
      </div>
      <div className="font-bold">{creation.info.name}</div>
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
