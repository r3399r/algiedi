import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { RootState } from 'src/redux/store';
import Avatar from './Avatar';
import Button from './Button';
import Drawer, { DrawerProps } from './Drawer';

type NavbarDrawerProps = DrawerProps & {
  onClose: () => void;
};

const NavbarDrawer = ({ open, onClose }: NavbarDrawerProps) => {
  const navigate = useNavigate();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);
  const { avatar } = useSelector((rootState: RootState) => rootState.me);
  const pathname = useLocation().pathname;

  const goto = (path: string) => () => {
    onClose();
    navigate(path);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="ml-auto h-[30px] w-[30px] cursor-pointer" onClick={onClose}>
        x
      </div>
      {!isLogin && <Button onClick={() => navigate(Page.Login)}>Create Now</Button>}
      {isLogin && (
        <Avatar size={50} url={avatar} clickable onClick={() => navigate(Page.Overall)} />
      )}
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
          underline: pathname === `${Page.Explore}/idea`,
        })}
        onClick={goto(`${Page.Explore}/idea`)}
      >
        Explore Idea
      </div>
      <div
        className={classNames('mx-4 mt-3 cursor-pointer decoration-blue hover:underline', {
          underline: pathname === `${Page.Explore}/song`,
        })}
        onClick={goto(`${Page.Explore}/song`)}
      >
        Explore Songs
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
