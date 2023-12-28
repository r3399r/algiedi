import { Popover } from '@mui/material';
import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { User } from 'src/model/backend/entity/UserEntity';
import ListItem from './ListItem';

type Props = {
  open: boolean;
  onClose: () => void;
  anchorEl: Element | null;
  author: User[];
};

const UserMenu = ({ open, onClose, anchorEl, author }: Props) => {
  const navigate = useNavigate();

  return (
    <Popover open={open} anchorEl={anchorEl} onBlur={onClose}>
      <div className="rounded bg-[#fafafa] shadow-lg">
        {author.map((v) => (
          <ListItem
            key={v.id}
            onClick={(e: MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              navigate(`${Page.Explore}/user/${v.id}`);
              onClose();
            }}
          >
            {v.username}
          </ListItem>
        ))}
      </div>
    </Popover>
  );
};

export default UserMenu;
