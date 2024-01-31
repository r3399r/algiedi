import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Cover from 'src/component/Cover';
import CoverInfo from 'src/component/CoverInfo';
import ExploreSearch from 'src/component/ExploreSearch';
import FollowButton from 'src/component/FollowButton';
import FooterDetail from 'src/component/FooterDetail';
import NotificationWidget from 'src/component/NotificationWidget';
import IcFacebook from 'src/image/ic-facebook.svg';
import IcInstagram from 'src/image/ic-instagram.svg';
import IcSoundcloud from 'src/image/ic-soundcloud.svg';
import IcYoutube from 'src/image/ic-youtube.svg';
import { GetExploreUserIdResponse } from 'src/model/backend/api/Explore';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getUserById } from 'src/service/ExploreService';

const ExploreUserDetail = () => {
  const navigate = useNavigate();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [user, setUser] = useState<GetExploreUserIdResponse>();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (id === undefined) return;
    getUserById(id)
      .then((res) => setUser(res))
      .catch((err) => dispatch(openFailSnackbar(err)));
  }, [id, refresh]);

  if (!user) return <>loading...</>;

  return (
    <div className="px-4">
      <div className="flex items-end justify-between">
        <ExploreSearch />
        {isLogin && <NotificationWidget />}
      </div>
      <div onClick={() => navigate(-1)} className="my-4 cursor-pointer">
        {'<Back'}
      </div>
      <div className="mb-4 text-xl font-bold">Profile</div>
      <div className="flex">
        <div className="w-2/12">
          <Cover url={user.avatarUrl} type="user" />
        </div>
        <div className="w-3/12">
          <div className="text-2xl font-bold">{user.username}</div>
          <div className="mb-4">{user.role?.split(',').join('/')}</div>
          <FollowButton
            id={user.id}
            following={user.following}
            doRefresh={() => setRefresh(!refresh)}
          />
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
            <CoverInfo key={v.id} creation={v} />
          ))}
        </div>
      )}
      <div className="py-16">
        <FooterDetail />
      </div>
    </div>
  );
};

export default ExploreUserDetail;
