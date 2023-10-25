import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Cover from 'src/component/Cover';
import ExploreSearch from 'src/component/ExploreSearch';
import { Page } from 'src/constant/Page';
import IcFacebook from 'src/image/ic-facebook.svg';
import IcInstagram from 'src/image/ic-instagram.svg';
import IcSoundcloud from 'src/image/ic-soundcloud.svg';
import IcYoutube from 'src/image/ic-youtube.svg';
import { GetExploreUserIdResponse } from 'src/model/backend/api/Explore';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getUserById } from 'src/service/ExploreService';

const ExploreUserDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [user, setUser] = useState<GetExploreUserIdResponse>();

  useEffect(() => {
    if (id === undefined) return;
    getUserById(id)
      .then((res) => setUser(res))
      .catch((err) => dispatch(openFailSnackbar(err)));
  }, [id]);

  if (!user) return <>loading...</>;

  return (
    <div className="px-10">
      <ExploreSearch />
      <div onClick={() => navigate(-1)} className="my-4 cursor-pointer">
        {'<Back'}
      </div>
      <div className="mb-4 text-xl font-bold">Profile</div>
      <div className="flex">
        <div className="w-2/12">
          <Cover url={user.avatarUrl} />
        </div>
        <div className="w-3/12">
          <div className="text-2xl font-bold">{user.username}</div>
          <div>{user.role?.split(',').join('/')}</div>
        </div>
        <div className="flex w-7/12 flex-col gap-2">
          <div className="flex gap-2">
            <div className="w-1/4">Email</div>
            <div className="w-3/4">{user.email}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/4">Age</div>
            <div className="w-3/4">{user.age}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/4">Language</div>
            <div className="w-3/4">{user.language}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/4">Bio</div>
            <div className="w-3/4">{user.bio}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/4">Music tags</div>
            <div className="w-3/4">{user.tag}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/4">Links</div>
            <div className="flex w-3/4 gap-2">
              {user.facebook && (
                <img
                  src={IcFacebook}
                  className="w-5 cursor-pointer"
                  onClick={() => window.open(user.facebook ?? '', '_blank')}
                />
              )}
              {user.instagram && (
                <img
                  src={IcInstagram}
                  className="w-5 cursor-pointer"
                  onClick={() => window.open(user.instagram ?? '', '_blank')}
                />
              )}
              {user.youtube && (
                <img
                  src={IcYoutube}
                  className="w-5 cursor-pointer"
                  onClick={() => window.open(user.youtube ?? '', '_blank')}
                />
              )}
              {user.soundcloud && (
                <img
                  src={IcSoundcloud}
                  className="w-5 cursor-pointer"
                  onClick={() => window.open(user.soundcloud ?? '', '_blank')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 mt-10 text-xl font-bold">Recently Published</div>
      {user.song.length === 0 && <div>No published song</div>}
      {user.song.length > 0 && (
        <div className="flex flex-wrap gap-10">
          {user.song.map((v) => (
            <div
              key={v.id}
              className="flex cursor-pointer flex-col items-center"
              onClick={() => navigate(`${Page.Explore}/${v.id}`)}
            >
              <Cover url={v.info.coverFileUrl} />
              <div>{v.info.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreUserDetail;
