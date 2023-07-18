import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'src/component/Button';
import Checkbox from 'src/component/Checkbox';
import Input from 'src/component/Input';
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
  const { username, email } = useSelector((rootState: RootState) => rootState.me);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [role, setRole] = useState<string[]>([]);
  const [age, setAge] = useState<string>('');
  const [language, setLanguage] = useState<string[]>([]);
  const [bio, setBio] = useState<string>('');
  const [tag, setTag] = useState<string[]>([]);
  const [facebook, setFacebook] = useState<string>('');
  const [instagram, setInstagram] = useState<string>('');
  const [youtube, setYoutube] = useState<string>('');
  const [soundcloud, setSoundcloud] = useState<string>('');

  useEffect(() => {
    loadProfileData().then((res) => {
      setRole(res.role);
      setAge(res.age);
      setLanguage(res.language);
      setBio(res.bio);
      setTag(res.tag);
      setFacebook(res.facebook);
      setInstagram(res.instagram);
      setYoutube(res.youtube);
      setSoundcloud(res.soundcloud);
    });
  }, [refresh]);

  const onRoleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) setRole([...role, event.target.name]);
    else setRole(role.filter((v) => v !== event.target.name));
  };

  const onLangChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) setLanguage([...language, event.target.name]);
    else setLanguage(language.filter((v) => v !== event.target.name));
  };

  const onTagChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) setTag([...tag, event.target.name]);
    else setTag(tag.filter((v) => v !== event.target.name));
  };

  const onSave = () => {
    editProfile(role, age, language, bio, tag, facebook, instagram, youtube, soundcloud)
      .then(() => {
        dispatch(openSuccessSnackbar('Save Successfully'));
        setRefresh(!refresh);
      })
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <>
      <div className="text-[20px] font-bold">My profile</div>
      <div className="text-[14px] text-[#a7a7a7]">{role.join('/')}</div>
      <div className="mt-5 flex gap-4">
        <div className="text-[#4346e1] border-b-[1px] border-b-[#4346e1]">Basic information</div>
        <div>Exhibits</div>
        <div>Settings</div>
      </div>
      <div className="flex my-5 gap-1 justify-between items-center">
        <div className="flex items-center gap-6">
          <img src={IcProfile} />
          <div>
            <div className="text-[20px] font-bold">{username}</div>
            {isEdit ? (
              <div className="flex gap-2">
                {['Composer', 'Lyricist', 'Singer', 'Producer'].map((v) => (
                  <Checkbox
                    key={v}
                    checked={role.includes(v)}
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
        <Button
          color="purple"
          size="s"
          onClick={() => {
            setIsEdit(!isEdit);
            if (isEdit) onSave();
          }}
        >
          {isEdit ? 'Save' : 'Edit'}
        </Button>
      </div>
      <div className="flex h-[40px] items-center">
        <div className="w-[150px] text-dark">Email</div>
        <div className="flex-1">{email}</div>
      </div>
      <div className="flex h-[40px] items-center">
        <div className="w-[150px] text-dark">Age</div>
        <div className="flex-1">
          {isEdit ? (
            <Input
              value={age}
              disabled={!isEdit}
              onChange={(e) => setAge(e.target.value)}
              type="number"
            />
          ) : (
            <div>{age}</div>
          )}
        </div>
      </div>
      <div className="flex h-[40px] items-center">
        <div className="w-[150px] text-dark">Language</div>
        {isEdit ? (
          <div className="flex gap-2">
            {['Cantonese', 'Mandarin', 'English', 'Japanese'].map((v) => (
              <Checkbox
                key={v}
                checked={language.includes(v)}
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
      <div className="flex h-[40px] items-center">
        <div className="w-[150px] text-dark">Bio</div>
        <div className="flex-1">
          {isEdit ? (
            <Input value={bio} disabled={!isEdit} onChange={(e) => setBio(e.target.value)} />
          ) : (
            <div>{bio}</div>
          )}
        </div>
      </div>
      <div className="flex h-[40px] items-center">
        <div className="w-[150px] text-dark">Music tags</div>
        {isEdit ? (
          <div className="flex gap-2">
            {['Pop', 'Rock', 'Electronics'].map((v) => (
              <Checkbox
                key={v}
                checked={tag.includes(v)}
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
        <div className="w-[150px] text-dark leading-[40px]">Links</div>
        {isEdit ? (
          <div className="flex-1">
            <div className="flex gap-3 items-center">
              <img src={IcFacebook} className="w-4" />
              <div className="flex-1">
                <Input
                  placeholder="Enter a link"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 items-center my-1">
              <img src={IcInstagram} className="w-4" />
              <div className="flex-1">
                <Input
                  placeholder="Enter a link"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 items-center my-1">
              <img src={IcYoutube} className="w-4" />
              <div className="flex-1">
                <Input
                  placeholder="Enter a link"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <img src={IcSoundcloud} className="w-4" />
              <div className="flex-1">
                <Input
                  placeholder="Enter a link"
                  value={soundcloud}
                  onChange={(e) => setSoundcloud(e.target.value)}
                />
              </div>
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
