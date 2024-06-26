import MenuIcon from '@mui/icons-material/Menu';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import Logo from 'src/image/logo.svg';
import { RootState } from 'src/redux/store';
import { loadProfileData } from 'src/service/ProfileService';
import Avatar from './Avatar';
import Button from './Button';
import NavbarDrawer from './NavbarDrawer';
import NavbarExploreMenu from './NavbarExploreMenu';

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);
  const { avatar } = useSelector((rootState: RootState) => rootState.me);
  const pathname = useLocation().pathname;
  const exploreRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!avatar) loadProfileData();
  }, [avatar]);

  return (
    <>
      <div className="mx-4 flex flex-wrap items-center justify-between">
        <img src={Logo} className="cursor-pointer pt-2" onClick={() => navigate(Page.Home)} />
        <div className="hidden items-center gap-10 sm:flex">
          <div onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
            <div
              className={classNames('cursor-pointer decoration-blue hover:underline', {
                underline: pathname.startsWith(Page.Explore),
              })}
              onClick={() => {
                navigate(Page.Explore);
                setMenuOpen(false);
              }}
              ref={exploreRef}
            >
              Explore
            </div>
            <NavbarExploreMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              anchorEl={exploreRef.current}
            />
          </div>
          <div
            className={classNames('cursor-pointer decoration-blue hover:underline', {
              underline: pathname.startsWith(Page.AboutUs),
            })}
            onClick={() => navigate(Page.AboutUs)}
          >
            About
          </div>
          <div
            className={classNames('cursor-pointer decoration-blue hover:underline', {
              underline: pathname.startsWith(Page.Faq),
            })}
            onClick={() => navigate(Page.Faq)}
          >
            FAQ
          </div>
          <div
            className={classNames('cursor-pointer decoration-blue hover:underline', {
              underline: pathname.startsWith(Page.ContatUs),
            })}
            onClick={() => navigate(Page.ContatUs)}
          >
            Contact Us
          </div>
          {!isLogin && <Button onClick={() => navigate(Page.Login)}>Create Now</Button>}
          {isLogin && (
            <Avatar size={50} url={avatar} clickable onClick={() => navigate(Page.Overall)} />
          )}
        </div>
        <div className="cursor-pointer sm:hidden" onClick={() => setOpen(true)}>
          <MenuIcon />
        </div>
      </div>
      <NavbarDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Navbar;
