import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from 'src/component/Checkbox';
import IcFacebook from 'src/image/ic-facebook.svg';
import IcInstagram from 'src/image/ic-instagram.svg';
import IcProfile from 'src/image/ic-profile.svg';
import IcSoundcloud from 'src/image/ic-soundcloud.svg';
import IcYoutube from 'src/image/ic-youtube.svg';
import Sample1 from 'src/image/sample1.png';
import Sample2 from 'src/image/sample2.png';
import Sample3 from 'src/image/sample3.png';
import { RootState } from 'src/redux/store';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { editProfile, loadProfileData } from 'src/service/ProfileService';

const Profile = () => {
  const dispatch = useDispatch();
  const {
    role,
    username,
    email,
    language,
    bio,
    age,
    tag,
    facebook,
    instagram,
    youtube,
    soundcloud,
  } = useSelector((rootState: RootState) => rootState.me);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [editRole, setEditRole] = useState<string[]>([]);
  const [editAge, setEditAge] = useState<string>('');
  const [editLang, setEditLang] = useState<string[]>([]);
  const [editBio, setEditBio] = useState<string>('');
  const [editTag, setEditTag] = useState<string[]>([]);
  const [editFacebook, setEditFacebook] = useState<string>('');
  const [editInstagram, setEditInstagram] = useState<string>('');
  const [editYoutube, setEditYoutube] = useState<string>('');
  const [editSoundcloud, setEditSoundcloud] = useState<string>('');

  useEffect(() => {
    loadProfileData();
  }, [refresh]);

  const onRoleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) setEditRole([...editRole, event.target.name]);
    else setEditRole(editRole.filter((v) => v !== event.target.name));
  };

  const onLangChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) setEditLang([...editLang, event.target.name]);
    else setEditLang(editLang.filter((v) => v !== event.target.name));
  };

  const onTagChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) setEditTag([...editTag, event.target.name]);
    else setEditTag(editTag.filter((v) => v !== event.target.name));
  };

  const onSave = () => {
    editProfile(
      editRole,
      editAge,
      editLang,
      editBio,
      editTag,
      editFacebook,
      editInstagram,
      editYoutube,
      editSoundcloud,
    )
      .then(() => {
        dispatch(openSuccessSnackbar('Save Successfully'));
        setRefresh(!refresh);
      })
      .catch((err) => dispatch(openFailSnackbar(err)));
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
            <div className="text-[20px] font-bold">{username}</div>
            {isEdit ? (
              <div className="border-[1px] border-[#c2c2c2] rounded-[20px] h-[21px] px-2 text-[10px] flex gap-2">
                {['Composer', 'Lyricist', 'Singer', 'Producer'].map((v) => (
                  <Checkbox
                    key={v}
                    checked={editRole.includes(v)}
                    name={v}
                    label={v}
                    onChange={onRoleChange}
                  />
                ))}
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
            else {
              setEditRole(role);
              setEditAge(age ?? '');
              setEditLang(language);
              setEditBio(bio ?? '');
              setEditTag(tag);
              setEditFacebook(facebook ?? '');
              setEditInstagram(instagram ?? '');
              setEditYoutube(youtube ?? '');
              setEditSoundcloud(soundcloud ?? '');
            }
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
            value={editAge}
            onChange={(e) => setEditAge(e.target.value)}
            type="number"
          />
        ) : (
          <div>{age}</div>
        )}
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Language</div>
        {isEdit ? (
          <div className="border-[1px] border-[#c2c2c2] rounded-[20px] h-[21px] px-2 text-[10px] flex gap-2">
            {['Cantonese', 'Mandarin', 'English', 'Japanese'].map((v) => (
              <Checkbox
                key={v}
                checked={editLang.includes(v)}
                name={v}
                label={v}
                onChange={onLangChange}
              />
            ))}
          </div>
        ) : (
          <div>{language.join()}</div>
        )}
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Bio</div>
        {isEdit ? (
          <textarea
            className="border-[1px] border-[#c2c2c2] bg-[#eaeaea] rounded-[20px] h-[100px] w-[300px] px-2 text-[10px]"
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
          />
        ) : (
          <div className="whitespace-pre-line">{bio}</div>
        )}
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Music tags</div>
        {isEdit ? (
          <div className="border-[1px] border-[#c2c2c2] rounded-[20px] h-[21px] px-2 text-[10px] flex gap-2">
            {['Pop', 'Rock', 'Electronics'].map((v) => (
              <Checkbox
                key={v}
                checked={editTag.includes(v)}
                name={v}
                label={v}
                onChange={onTagChange}
              />
            ))}
          </div>
        ) : (
          <div>{tag.join()}</div>
        )}
      </div>
      <div className="flex">
        <div className="w-[150px] text-[#2d2d2d]">Links</div>
        {isEdit ? (
          <div>
            <div className="flex gap-3 items-center">
              <img src={IcFacebook} className="w-4" />
              <input
                className="border-[1px] border-[#c2c2c2] bg-[#eaeaea] rounded-[20px] h-[21px] w-[300px] px-2 text-[10px]"
                placeholder="Enter a link"
                value={editFacebook}
                onChange={(e) => setEditFacebook(e.target.value)}
              />
            </div>
            <div className="flex gap-3 items-center my-1">
              <img src={IcInstagram} className="w-4" />
              <input
                className="border-[1px] border-[#c2c2c2] bg-[#eaeaea] rounded-[20px] h-[21px] w-[300px] px-2 text-[10px]"
                placeholder="Enter a link"
                value={editInstagram}
                onChange={(e) => setEditInstagram(e.target.value)}
              />
            </div>
            <div className="flex gap-3 items-center my-1">
              <img src={IcYoutube} className="w-4" />
              <input
                className="border-[1px] border-[#c2c2c2] bg-[#eaeaea] rounded-[20px] h-[21px] w-[300px] px-2 text-[10px]"
                placeholder="Enter a link"
                value={editYoutube}
                onChange={(e) => setEditYoutube(e.target.value)}
              />
            </div>
            <div className="flex gap-3 items-center">
              <img src={IcSoundcloud} className="w-4" />
              <input
                className="border-[1px] border-[#c2c2c2] bg-[#eaeaea] rounded-[20px] h-[21px] w-[300px] px-2 text-[10px]"
                placeholder="Enter a link"
                value={editSoundcloud}
                onChange={(e) => setEditSoundcloud(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            {facebook && facebook.length > 0 && (
              <a href={facebook} target="_blank" rel="noreferrer">
                <img src={IcFacebook} className="w-4" />
              </a>
            )}
            {instagram && instagram.length > 0 && (
              <a href={instagram} target="_blank" rel="noreferrer">
                <img src={IcInstagram} className="w-4" />
              </a>
            )}
            {youtube && youtube.length > 0 && (
              <a href={youtube} target="_blank" rel="noreferrer">
                <img src={IcYoutube} className="w-4" />
              </a>
            )}
            {soundcloud && soundcloud.length > 0 && (
              <a href={soundcloud} target="_blank" rel="noreferrer">
                <img src={IcSoundcloud} className="w-4" />
              </a>
            )}
          </div>
        )}
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
