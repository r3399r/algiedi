import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'src/component/Avatar';
import Button from 'src/component/Button';
import Checkbox from 'src/component/Checkbox';
import Input from 'src/component/Input';
import { Genre, Language, Role } from 'src/constant/Property';
import IcFacebook from 'src/image/ic-facebook.svg';
import IcInstagram from 'src/image/ic-instagram.svg';
import IcSoundcloud from 'src/image/ic-soundcloud.svg';
import IcYoutube from 'src/image/ic-youtube.svg';
import { RootState } from 'src/redux/store';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { editProfile, loadProfileData, updateAvatar } from 'src/service/ProfileService';

const BasicInfo = () => {
  const dispatch = useDispatch();
  const { username, email, avatar } = useSelector((rootState: RootState) => rootState.me);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
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
      <div className="my-5 flex items-center justify-between gap-1">
        <div className="flex items-center gap-6">
          <Avatar
            url={avatar}
            size={120}
            clickable
            onClick={() => avatarInputRef.current?.click()}
          />
          <div>
            <div className="text-[20px] font-bold">{username}</div>
            {isEdit ? (
              <div className="flex gap-2">
                {Role.map((v, i) => (
                  <Checkbox
                    key={i}
                    checked={role.includes(v.name)}
                    name={v.name}
                    label={v.name}
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
            {Language.map((v, i) => (
              <Checkbox
                key={i}
                checked={language.includes(v.name)}
                name={v.name}
                label={v.name}
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
            {Genre.map((v, i) => (
              <Checkbox
                key={i}
                checked={tag.includes(v.name)}
                name={v.name}
                label={v.name}
                onChange={onTagChange}
              />
            ))}
          </div>
        ) : (
          <div>{tag.join()}</div>
        )}
      </div>
      <div className="flex">
        <div className="w-[150px] leading-[40px] text-dark">Links</div>
        {isEdit ? (
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <img src={IcFacebook} className="w-4" />
              <div className="flex-1">
                <Input
                  placeholder="Enter a link"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
            </div>
            <div className="my-1 flex items-center gap-3">
              <img src={IcInstagram} className="w-4" />
              <div className="flex-1">
                <Input
                  placeholder="Enter a link"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
            </div>
            <div className="my-1 flex items-center gap-3">
              <img src={IcYoutube} className="w-4" />
              <div className="flex-1">
                <Input
                  placeholder="Enter a link"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
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
          <div className="flex items-center gap-2">
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
      <input
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length === 1)
            updateAvatar(e.target.files[0]).then(() => setRefresh(!refresh));
        }}
        ref={avatarInputRef}
        className="hidden"
        accept="image/jpeg"
        multiple={false}
      />
    </>
  );
};

export default BasicInfo;
