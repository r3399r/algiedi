import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import IcProfile from 'src/image/ic-profile.svg';
import Logo from 'src/image/logo.svg';
import { RootState } from 'src/redux/store';
import { logout } from 'src/service/AuthService';
import { loadProfileData } from 'src/service/ProfileService';
import Divider from './Divider';

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useSelector((rootState: RootState) => rootState.me);

  useEffect(() => {
    if (location.pathname !== Page.Profile) loadProfileData();
  }, [location.pathname]);

  return (
    <div className="box-border h-screen w-[256px] overflow-y-auto bg-dark text-white">
      <div className="px-4 py-2">
        <img src={Logo} className="cursor-pointer" onClick={() => navigate(Page.Home)} />
      </div>
      <div
        className="flex cursor-pointer items-center gap-4 px-4 py-2 hover:bg-grey"
        onClick={() => navigate(Page.Profile)}
      >
        <img src={IcProfile} />
        <div>{username}</div>
      </div>
      <Divider className="bg-grey" />
      <div
        className="cursor-pointer px-4 py-2 hover:bg-grey"
        onClick={() => navigate(Page.Overall)}
      >
        Overall
      </div>
      <div
        className="cursor-pointer px-4 py-2 hover:bg-grey"
        onClick={() => navigate(Page.Project)}
      >
        Project
      </div>
      <div className="cursor-pointer px-4 py-2 hover:bg-grey" onClick={() => navigate(Page.Upload)}>
        Upload
      </div>
      <div
        className="cursor-pointer px-4 py-2 hover:bg-grey"
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
