import { Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import ExploreSearch from 'src/component/ExploreSearch';
import FollowButton from 'src/component/FollowButton';
import FooterDetail from 'src/component/FooterDetail';
import MultiSelect from 'src/component/MultiSelect';
import MultiSelectOption from 'src/component/MultiSelectOption';
import NotificationWidget from 'src/component/NotificationWidget';
import { Page } from 'src/constant/Page';
import { Role } from 'src/constant/Property';
import useQuery from 'src/hook/useQuery';
import IcFacebook from 'src/image/ic-facebook.svg';
import IcInstagram from 'src/image/ic-instagram.svg';
import IcSoundcloud from 'src/image/ic-soundcloud.svg';
import IcYoutube from 'src/image/ic-youtube.svg';
import { GetExploreUserResponse } from 'src/model/backend/api/Explore';
import { RootState } from 'src/redux/store';
import { getExploreUser } from 'src/service/ExploreService';

const DEFAULT_LIMIT = '10';

const ExploreUser = () => {
  const navigate = useNavigate();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);
  const query = useQuery<{ tab?: string; keyword?: string }>();
  const [user, setUser] = useState<GetExploreUserResponse>();
  const [role, setRole] = useState<string>('');
  const [refresh, setRefresh] = useState<boolean>();
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    getExploreUser({
      limit: DEFAULT_LIMIT,
      offset: String(offset),
      keyword: query.keyword,
      role,
    }).then((res) => {
      setUser(res.data);
      setCount(res.paginate.count);
    });
  }, [refresh, offset, role, query.keyword]);

  const handlePaginationChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * Number(DEFAULT_LIMIT));
  };

  return (
    <div className="bg-[#fafafa] px-4">
      <div className="flex items-end justify-between">
        <ExploreSearch />
        {isLogin && <NotificationWidget />}
      </div>
      <div className="mb-4 text-xl font-bold">EXPLORE USER</div>
      <div className="mb-4 flex items-center gap-2">
        <div className="text-lg font-bold">Role</div>
        <MultiSelect onChange={(v) => setRole(v)}>
          {Role.map((v) => v.name).map((v, i) => (
            <MultiSelectOption key={i} value={v}>
              {v}
            </MultiSelectOption>
          ))}
        </MultiSelect>
      </div>
      <div className="mt-4 flex flex-wrap gap-6">
        {user?.map((v) => (
          <div
            key={v.id}
            className="relative flex w-[calc(50%-12px)] cursor-pointer items-center gap-2 rounded-xl bg-white p-4 hover:bg-blue/30"
            onClick={() => navigate(`${Page.Explore}/user/${v.id}`)}
          >
            <div className="flex w-1/3 flex-col items-center">
              <Cover url={v.avatarUrl} size={100} type="user" />
              <div className="flex h-5 gap-1">
                {v.facebook && <img src={IcFacebook} className="w-5" />}
                {v.instagram && <img src={IcInstagram} className="w-5" />}
                {v.youtube && <img src={IcYoutube} className="w-5" />}
                {v.soundcloud && <img src={IcSoundcloud} className="w-5" />}
              </div>
            </div>
            <div className="w-2/3">
              <div className="font-bold">{v.username}</div>
              <div className="flex gap-1">
                {v.role?.split(',').map((o, i) => (
                  <div
                    key={i}
                    className="my-2 w-fit rounded-xl border border-black bg-white px-1 text-xs"
                  >
                    {o}
                  </div>
                ))}
              </div>
              <div className="text-xs">{v.bio}</div>
            </div>
            <div className="absolute bottom-4 right-4 flex">
              <FollowButton
                id={v.id}
                following={v.following}
                doRefresh={() => setRefresh(!refresh)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="my-4 flex justify-center">
        <Pagination
          count={Math.ceil(count / Number(DEFAULT_LIMIT))}
          page={page}
          onChange={handlePaginationChange}
        />
      </div>
      <div className="py-16">
        <FooterDetail />
      </div>
    </div>
  );
};

export default ExploreUser;
