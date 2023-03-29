import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import IcProfile from 'src/image/ic-profile.svg';
import Logo from 'src/image/logo.svg';
import { RootState } from 'src/redux/store';
import Divider from './Divider';

const SideMenu = () => {
  const navigate = useNavigate();
  const { firstName, lastName } = useSelector((rootState: RootState) => rootState.me);

  return (
    <div className="h-screen w-[256px] box-border bg-[#2d2d2d] text-white">
      <div className="px-4 py-2">
        <img src={Logo} className="cursor-pointer" onClick={() => navigate(Page.Home)} />
        <div className="flex gap-4 items-center my-2">
          <img src={IcProfile} />
          <div>
            {firstName} {lastName}
          </div>
        </div>
      </div>
      <Divider className="bg-gray-600" />
      <div className="p-4">
        <div>Overall</div>
        <div>Projects</div>
        <div>Upload</div>
        <div>Practice Room</div>
        <div>Notifications</div>
        <div>Explore</div>
      </div>
      <Divider className="bg-gray-600" />
      <div className="p-4">
        <div>GROUPS</div>
        <div>Lyrics</div>
        <div>Music</div>
        <div>Add Group</div>
      </div>{' '}
    </div>
  );
};

export default SideMenu;
