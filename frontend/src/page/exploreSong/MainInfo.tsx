import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { MouseEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import UserMenu from 'src/component/UserMenu';
import { Page } from 'src/constant/Page';
import usePlayer from 'src/hook/usePlayer';
import { GetExploreResponse } from 'src/model/backend/api/Explore';

type Props = { creation: GetExploreResponse[0] };

const MainInfo = ({ creation }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const onPlay = usePlayer();
  const [isHover, setIsHover] = useState<boolean>(false);
  const {
    info: { name },
    user: author,
  } = creation;
  const navigate = useNavigate();

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Cover url={creation.info.coverFileUrl} size={50} />
        {isHover && (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red/70 hover:bg-red"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              onPlay({
                id: creation.id,
                info: creation.info,
                fileUrl: creation.fileUrl,
                username: creation.user[0].username,
              });
            }}
          >
            <PlayArrowIcon className="text-white" />
          </div>
        )}
      </div>
      <div>
        <div className="font-bold hover:text-blue">{name}</div>
        {author.length === 1 && (
          <div
            className="text-sm text-grey hover:text-blue"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              navigate(`${Page.Explore}/user/${author[0].id}`);
            }}
          >
            {author[0].username}
          </div>
        )}
        {author.length > 1 && (
          <div className="flex items-center gap-2">
            <div className="text-sm text-grey">{`${author[0].username} & ${
              author.length - 1
            } others`}</div>
            <div
              onClick={(e: MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              ref={ref}
            >
              <InfoOutlinedIcon fontSize="small" className="text-grey hover:text-blue" />
            </div>
          </div>
        )}
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
