import { useSelector } from 'react-redux';
import IcProfile from 'src/image/ic-profile.svg';
import Sample1 from 'src/image/sample1.png';
import Sample2 from 'src/image/sample2.png';
import Sample3 from 'src/image/sample3.png';
import { RootState } from 'src/redux/store';

const Profile = () => {
  const { role, firstName, lastName, email, language, bio } = useSelector(
    (rootState: RootState) => rootState.me,
  );

  return (
    <>
      <div className="text-[20px]">My profile</div>
      <div className="text-[14px] text-[#a7a7a7]">{role.join('/')}</div>
      <div className="mt-5 flex gap-4">
        <div>Basic information</div>
        <div>Exhibits</div>
        <div>Settings</div>
      </div>
      <div className="flex my-5 gap-1 justify-between">
        <div className="flex items-center gap-6">
          <img src={IcProfile} />
          <div>
            <div className="text-[20px] font-bold">
              {firstName} {lastName}
            </div>
            <div className="text-[14px]">{role.join('/')}</div>
          </div>
        </div>
        <div className="cursor-pointer">Edit</div>
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Email</div>
        <div>{email}</div>
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Age</div>
        <div>24</div>
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Language</div>
        <div>{language.join()}</div>
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Bio</div>
        <div>{bio}</div>
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Music tags</div>
        <div>Pop, jaxx, R&B/Soul</div>
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Links</div>
        <div>Youtube</div>
      </div>
      <div className="my-6 text-[18px] font-bold">Recently Published</div>
      <div className="flex gap-6">
        <div className="text-center">
          <img src={Sample1} className="w-[150px] h-[150px]" />
          <div>愛贏</div>
        </div>
        <div className="text-center">
          <img src={Sample2} className="w-[150px] h-[150px]" />
          <div>有隻落水</div>
        </div>
        <div className="text-center">
          <img src={Sample3} className="w-[150px] h-[150px]" />
          <div>於是以後</div>
        </div>
      </div>
    </>
  );
};

export default Profile;
