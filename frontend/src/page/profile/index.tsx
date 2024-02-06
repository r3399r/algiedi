import { useDispatch, useSelector } from 'react-redux';
import Footer from 'src/component/Footer';
import NotificationWidget from 'src/component/NotificationWidget';
import Tabs from 'src/component/Tabs';
import { RootState } from 'src/redux/store';
import { setProfileTab } from 'src/redux/uiSlice';
import BasicInfo from './BasicInfo';
import Exhibits from './Exhibits';

const Profile = () => {
  const dispatch = useDispatch();
  const { role } = useSelector((rootState: RootState) => rootState.me);
  const { profileTab } = useSelector((rootState: RootState) => rootState.ui);

  return (
    <div className="relative">
      <div className="flex items-end justify-between">
        <div className="text-[20px] font-bold">My profile</div>
        <NotificationWidget />
      </div>
      <div className="text-[14px] text-[#a7a7a7]">{role.join('/')}</div>
      <div className="mt-5">
        <Tabs
          labels={['Basic information', 'Exhibits']}
          onChange={(i) => dispatch(setProfileTab(i))}
          defaultIndex={profileTab}
        />
      </div>
      {profileTab === 0 && <BasicInfo />}
      {profileTab === 1 && <Exhibits />}
      <div className="mx-auto max-w-[630px] py-16">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
