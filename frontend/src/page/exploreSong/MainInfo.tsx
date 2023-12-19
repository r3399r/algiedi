import { MouseEvent, useRef, useState } from 'react';
import Cover from 'src/component/Cover';
import UserMenu from 'src/component/UserMenu';
import { User } from 'src/model/backend/entity/UserEntity';

type Props = { coverFileUrl: string | null; name: string | null; author: User[] };

const MainInfo = ({ coverFileUrl, name, author }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <>
      <Cover url={coverFileUrl} size={50} />
      <div>
        <div className="font-bold">{name}</div>
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
