import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { RootState } from 'src/redux/store';
import Button from './Button';
import Drawer, { DrawerProps } from './Drawer';

type NavbarDrawerProps = DrawerProps & {
  onClose: () => void;
};

const NavbarDrawer = ({ open, onClose }: NavbarDrawerProps) => {
  const navigate = useNavigate();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);
  const pathname = useLocation().pathname;

  const goto = (path: Page) => () => {
    onClose();
    navigate(path);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="ml-auto h-[30px] w-[30px] cursor-pointer" onClick={onClose}>
        x
      </div>
      <Button onClick={() => navigate(isLogin ? Page.Profile : Page.Login)}>Create Now</Button>
      <div
        className={classNames('mx-4 mt-3 cursor-pointer decoration-blue hover:underline', {
          underline: pathname === Page.Explore,
        })}
        onClick={goto(Page.Explore)}
      >
        Explore
      </div>
      <div
        className={classNames('mx-4 mt-3 cursor-pointer decoration-blue hover:underline', {
          underline: pathname === Page.AboutUs,
        })}
        onClick={goto(Page.AboutUs)}
      >
        About
      </div>
      <div
        className={classNames('mx-4 mt-3 cursor-pointer decoration-blue hover:underline', {
          underline: pathname === Page.Faq,
        })}
        onClick={goto(Page.Faq)}
      >
        FAQ
      </div>
      <div
        className={classNames('mx-4 mt-3 cursor-pointer decoration-blue hover:underline', {
          underline: pathname === Page.ContatUs,
        })}
        onClick={goto(Page.ContatUs)}
      >
        Contact Us
      </div>
    </Drawer>
  );
};

export default NavbarDrawer;
