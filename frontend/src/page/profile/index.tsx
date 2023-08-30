import { useState } from 'react';
import { useSelector } from 'react-redux';
import NotificationWidget from 'src/component/NotificationWidget';
import Tabs from 'src/component/Tabs';
import { RootState } from 'src/redux/store';
import BasicInfo from './BasicInfo';
import Exhibits from './Exhibits';

const Profile = () => {
  const { role } = useSelector((rootState: RootState) => rootState.me);
  const [tab, setTab] = useState<number>(0);

  return (
    <div className="relative">
      <NotificationWidget className="absolute right-0 top-0" />
      <div className="text-[20px] font-bold">My profile</div>
      <div className="text-[14px] text-[#a7a7a7]">{role.join('/')}</div>
      <div className="mt-5">
        <Tabs
          labels={['Basic information', 'Exhibits']}
          onChange={(i) => setTab(i)}
          defaultIndex={0}
        />
      </div>
      {tab === 0 && <BasicInfo />}
      {tab === 1 && <Exhibits />}
    </div>
  );
};

export default Profile;
