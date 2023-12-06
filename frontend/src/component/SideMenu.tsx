import classNames from 'classnames';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import Logo from 'src/image/logo.svg';
import { RootState } from 'src/redux/store';
import { logout } from 'src/service/AuthService';
import { loadProfileData } from 'src/service/ProfileService';
import Avatar from './Avatar';
import Divider from './Divider';

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, avatar } = useSelector((rootState: RootState) => rootState.me);

  useEffect(() => {
    if (location.pathname !== Page.Profile && !username) loadProfileData();
  }, [location.pathname]);

  return (
    <div className="box-border h-screen w-[256px] overflow-y-auto bg-dark text-white">
      <div className="px-4 py-2">
        <img src={Logo} className="cursor-pointer" onClick={() => navigate(Page.Home)} />
      </div>
      <div
        className={classNames('flex cursor-pointer items-center gap-4 px-4 py-2 hover:bg-grey', {
          'bg-grey': location.pathname === Page.Profile,
        })}
        onClick={() => navigate(Page.Profile)}
      >
        <Avatar url={avatar} size={60} />
        <div>{username}</div>
      </div>
      <Divider className="bg-grey" />
      <div
        className={classNames('cursor-pointer px-4 py-2 hover:bg-grey', {
          'bg-grey': location.pathname === Page.Overall,
        })}
        onClick={() => navigate(Page.Overall)}
      >
        Overall
      </div>
      <div
        className={classNames('cursor-pointer px-4 py-2 hover:bg-grey', {
          'bg-grey': location.pathname === Page.Project,
        })}
        onClick={() => navigate(Page.Project)}
      >
        Latest Project
      </div>
      <div
        className={classNames('cursor-pointer px-4 py-2 hover:bg-grey', {
          'bg-grey': location.pathname === Page.Upload,
        })}
        onClick={() => navigate(Page.Upload)}
      >
        Upload
      </div>
      <div
        className={classNames('cursor-pointer px-4 py-2 hover:bg-grey', {
          'bg-grey': location.pathname === Page.Notification,
        })}
        onClick={() => navigate(Page.Notification)}
      >
        Notifications
      </div>
      <div
        className="cursor-pointer px-4 py-2 hover:bg-grey"
        onClick={() => navigate(Page.Explore)}
      >
        Explore
      </div>
      <Divider className="bg-grey" />
      <div className="cursor-pointer px-4 py-2 hover:bg-grey" onClick={logout}>
        Sign out
      </div>
    </div>
  );
};

export default SideMenu;
