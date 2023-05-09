import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import IcProfile from 'src/image/ic-profile.svg';
import Logo from 'src/image/logo.svg';
import { RootState } from 'src/redux/store';
import { logout } from 'src/service/AuthService';
import { loadProfileData } from 'src/service/ProfileService';
import Divider from './Divider';

const SideMenu = () => {
  const navigate = useNavigate();
  const { userName } = useSelector((rootState: RootState) => rootState.me);

  useEffect(() => {
    loadProfileData();
  }, []);

  return (
    <div className="h-screen w-[256px] box-border bg-[#2d2d2d] text-white overflow-y-auto">
      <div className="px-4 py-2">
        <img src={Logo} className="cursor-pointer" onClick={() => navigate(Page.Home)} />
      </div>
      <div
        className="flex gap-4 items-center px-4 py-2 cursor-pointer hover:bg-gray-500"
        onClick={() => navigate(Page.Profile)}
      >
        <img src={IcProfile} />
        <div>{userName}</div>
      </div>
      <Divider className="bg-gray-600" />
      <div className="px-4 py-2 cursor-pointer hover:bg-gray-500">Overall</div>
      <div
        className="px-4 py-2 cursor-pointer hover:bg-gray-500"
        onClick={() => navigate(Page.Project)}
      >
        Projects
      </div>
      <div
        className="px-4 py-2 cursor-pointer hover:bg-gray-500"
        onClick={() => navigate(Page.Upload)}
      >
        Upload
      </div>
      <div className="px-4 py-2 cursor-pointer hover:bg-gray-500">Practice Room</div>
      <div className="px-4 py-2 cursor-pointer hover:bg-gray-500">Notifications</div>
      <div className="px-4 py-2 cursor-pointer hover:bg-gray-500">Explore</div>
      <Divider className="bg-gray-600" />
      <div className="px-4 py-2 cursor-pointer hover:bg-gray-500">GROUPS</div>
      <div className="px-4 py-2 cursor-pointer hover:bg-gray-500">Lyrics</div>
      <div className="px-4 py-2 cursor-pointer hover:bg-gray-500">Music</div>
      <div className="px-4 py-2 cursor-pointer hover:bg-gray-500">Add Group</div>
      <Divider className="bg-gray-600" />
      <div className="px-4 py-2 cursor-pointer hover:bg-gray-500" onClick={logout}>
        Sign out
      </div>
    </div>
  );
};

export default SideMenu;
