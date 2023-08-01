import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { RootState } from 'src/redux/store';
import Drawer, { DrawerProps } from './Drawer';

type NavbarDrawerProps = DrawerProps & {
  onClose: () => void;
};

const NavbarDrawer = ({ open, onClose }: NavbarDrawerProps) => {
  const navigate = useNavigate();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);

  const goto = (path: Page) => () => {
    onClose();
    navigate(path);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="ml-auto h-[30px] w-[30px]" onClick={onClose}>
        x
      </div>
      <div className="px-4 pb-1 pt-2" onClick={() => navigate(isLogin ? Page.Profile : Page.Login)}>
        Create Now
      </div>
      <div className="px-4 pb-1 pt-2" onClick={goto(Page.Explore)}>
        Explore
      </div>
      <div className="px-4 pb-1 pt-2" onClick={goto(Page.AboutUs)}>
        About
      </div>
      <div className="px-4 pb-1 pt-2" onClick={goto(Page.Faq)}>
        FAQ
      </div>
      <div className="px-4 pb-1 pt-2" onClick={goto(Page.ContatUs)}>
        Contact Us
      </div>
    </Drawer>
  );
};

export default NavbarDrawer;
