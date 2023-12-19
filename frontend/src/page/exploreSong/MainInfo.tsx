import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { MouseEvent, useRef, useState } from 'react';
import Cover from 'src/component/Cover';
import UserMenu from 'src/component/UserMenu';
import usePlayer from 'src/hook/usePlayer';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { User } from 'src/model/backend/entity/UserEntity';

type Props = { creation: GetExploreResponse[0]; name: string | null; author: User[] };

const MainInfo = ({ creation, name, author }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const onPlay = usePlayer();

  return (
    <>
      <div
        className="relative"
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          onPlay({
            id: creation.id,
            info: creation.info,
            fileUrl: creation.fileUrl,
            owner: creation.user[0],
          });
        }}
      >
        <Cover url={creation.info.coverFileUrl} size={50} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <PlayArrowIcon className="text-white" />
        </div>
      </div>
      <div>
        <div className="font-bold">{name}</div>
        <div
          className="text-sm text-grey hover:text-blue"
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          ref={ref}
        >{`${author.length > 0 ? author[0].username : ''}${
          author.length > 1 ? ` & ${author.length - 1} others` : ''
        }`}</div>
        {author && (
          <UserMenu
            open={menuOpen}
            anchorEl={ref.current}
            onClose={() => setMenuOpen(false)}
            author={author}
          />
        )}
      </div>
    </>
  );
};

export default MainInfo;
