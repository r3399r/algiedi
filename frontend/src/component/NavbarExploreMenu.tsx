import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import ListItem from './ListItem';
import Popover from './Popover';

type Props = { open: boolean; onClose: () => void; anchorEl: Element | null };

const NavbarExploreMenu = ({ open, onClose, anchorEl }: Props) => {
  const navigate = useNavigate();

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      className="py-[5px]"
    >
      <ListItem
        onClick={() => {
          navigate(Page.Explore);
          onClose();
        }}
      >
        Explore Home
      </ListItem>
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
    </Popover>
  );
};

export default NavbarExploreMenu;
