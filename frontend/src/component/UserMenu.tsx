import { Popper } from '@mui/material';
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
    <Popper open={open} anchorEl={anchorEl}>
      <div className="rounded bg-[#fafafa] shadow-lg">
        {author.map((v) => (
          <ListItem
            key={v.id}
            onClick={() => {
              navigate(`${Page.Explore}/user/${v.id}`);
              onClose();
            }}
          >
            {v.username}
          </ListItem>
        ))}
      </div>
    </Popper>
  );
};

export default UserMenu;
