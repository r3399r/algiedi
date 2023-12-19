import { MouseEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'src/model/backend/entity/UserEntity';
import Cover from './Cover';
import UserMenu from './UserMenu';

type Props = {
  size?: number;
  navigateTo?: string;
  coverFileUrl: string | null;
  name: string | null;
  author?: (User & { avatarUrl: string | null })[];
};

const CoverInfo = ({ size, navigateTo, coverFileUrl, name, author }: Props) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex cursor-pointer flex-col items-center text-center"
      onClick={() => {
        if (navigateTo) navigate(navigateTo);
      }}
    >
      <Cover url={coverFileUrl} size={size} />
      <div className="font-bold">{name}</div>
      {author && (
        <div
          className="text-sm text-grey"
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          ref={ref}
        >{`${author.length > 0 ? author[0].username : ''}${
          author.length > 1 ? ` & ${author.length - 1} others` : ''
        }`}</div>
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
  );
};

export default CoverInfo;
