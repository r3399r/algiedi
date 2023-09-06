import { Popper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import ListItem from './ListItem';

type Props = { open: boolean; onClose: () => void; anchorEl: Element | null };

const NavbarExploreMenu = ({ open, onClose, anchorEl }: Props) => {
  const navigate = useNavigate();

  return (
    <Popper open={open} anchorEl={anchorEl}>
      <div className="rounded bg-[#fafafa] shadow-lg">
        <ListItem
          onClick={() => {
            navigate(`${Page.Explore}/idea`);
            onClose();
          }}
        >
          Explore Idea
        </ListItem>
        <ListItem
          onClick={() => {
            navigate(`${Page.Explore}/song`);
            onClose();
          }}
        >
          Explore Songs
        </ListItem>
      </div>
    </Popper>
  );
};

export default NavbarExploreMenu;
