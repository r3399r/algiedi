import { ChangeEvent, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from 'src/component/Checkbox';
import IcProfile from 'src/image/ic-profile.svg';
import Sample1 from 'src/image/sample1.png';
import Sample2 from 'src/image/sample2.png';
import Sample3 from 'src/image/sample3.png';
import { setAge, setBio, setLanguage, setRole } from 'src/redux/meSlice';
import { RootState } from 'src/redux/store';
import { editProfile } from 'src/service/ProfileService';

const Profile = () => {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { role, userName, email, language, bio, age } = useSelector(
    (rootState: RootState) => rootState.me,
  );
  const selectedRole = useMemo(
    () => ({
      composer: role.includes('Composer'),
      lyricist: role.includes('Lyricist'),
      singer: role.includes('Singer'),
      producer: role.includes('Producer'),
    }),
    [role],
  );
  const inputAge = useMemo(() => age, [age]);
  const selectedLang = useMemo(
    () => ({
      cantonese: language.includes('Cantonese'),
      mandarin: language.includes('Mandarin'),
      english: language.includes('English'),
      japanese: language.includes('Japanese'),
    }),
    [language],
  );
  const inputBio = useMemo(() => bio, [bio]);

  const onRoleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) dispatch(setRole([...role, event.target.name]));
    else dispatch(setRole(role.filter((v) => v !== event.target.name)));
  };

  const onLangChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) dispatch(setLanguage([...language, event.target.name]));
    else dispatch(setLanguage(language.filter((v) => v !== event.target.name)));
  };

  const onSave = () => {
    editProfile(role, age ?? '', language, bio ?? '');
  };

  return (
    <>
      <div className="text-[20px]">My profile</div>
      <div className="text-[14px] text-[#a7a7a7]">{role.join('/')}</div>
      <div className="mt-5 flex gap-4">
        <div className="text-[#4346e1] border-b-[1px] border-b-[#4346e1]">Basic information</div>
        <div>Exhibits</div>
        <div>Settings</div>
      </div>
      <div className="flex my-5 gap-1 justify-between">
        <div className="flex items-center gap-6">
          <img src={IcProfile} />
          <div>
            <div className="text-[20px] font-bold">{userName}</div>
            {isEdit ? (
              <div className="border-[1px] border-[#c2c2c2] rounded-[20px] h-[21px] px-2 text-[10px] flex gap-2">
                <Checkbox
                  checked={selectedRole.composer}
                  name="Composer"
                  label="Composer"
                  onChange={onRoleChange}
                />
                <Checkbox
                  checked={selectedRole.lyricist}
                  name="Lyricist"
                  label="Lyricist"
                  onChange={onRoleChange}
                />
                <Checkbox
                  checked={selectedRole.singer}
                  name="Singer"
                  label="Singer"
                  onChange={onRoleChange}
                />
                <Checkbox
                  checked={selectedRole.producer}
                  name="Producer"
                  label="Producer"
                  onChange={onRoleChange}
                />
              </div>
            ) : (
              <div className="text-[14px]">{role.join('/')}</div>
            )}
          </div>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => {
            setIsEdit(!isEdit);
            if (isEdit) onSave();
          }}
        >
          {isEdit ? 'Save' : 'Edit'}
        </div>
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Email</div>
        <div>{email}</div>
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Age</div>
        {isEdit ? (
          <input
            className="border-[1px] border-[#c2c2c2] bg-[#eaeaea] rounded-[20px] h-[21px] w-[300px] px-2 text-[10px]"
            value={inputAge}
            onChange={(e) => dispatch(setAge(e.target.value))}
          />
        ) : (
          <div>{age}</div>
        )}
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Language</div>
        {isEdit ? (
          <div className="border-[1px] border-[#c2c2c2] rounded-[20px] h-[21px] px-2 text-[10px] flex gap-2">
            <Checkbox
              checked={selectedLang.cantonese}
              name="Cantonese"
              label="Cantonese"
              onChange={onLangChange}
            />
            <Checkbox
              checked={selectedLang.mandarin}
              name="Mandarin"
              label="Mandarin"
              onChange={onLangChange}
            />
            <Checkbox
              checked={selectedLang.english}
              name="English"
              label="English"
              onChange={onLangChange}
            />
            <Checkbox
              checked={selectedLang.japanese}
              name="Japanese"
              label="Japanese"
              onChange={onLangChange}
            />
          </div>
        ) : (
          <div>{language.join()}</div>
        )}
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Bio</div>
        {isEdit ? (
          <input
            className="border-[1px] border-[#c2c2c2] bg-[#eaeaea] rounded-[20px] h-[21px] w-[300px] px-2 text-[10px]"
            value={inputBio}
            onChange={(e) => dispatch(setBio(e.target.value))}
          />
        ) : (
          <div>{bio}</div>
        )}
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
