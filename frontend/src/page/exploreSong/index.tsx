import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { Pagination } from '@mui/material';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ExploreSearch from 'src/component/ExploreSearch';
import NotificationWidget from 'src/component/NotificationWidget';
import Select from 'src/component/Select';
import SelectOption from 'src/component/SelectOption';
import Tabs from 'src/component/Tabs';
import { Page } from 'src/constant/Page';
import { Genre, Theme } from 'src/constant/Property';
import useQuery from 'src/hook/useQuery';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { RootState } from 'src/redux/store';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { getExploreSong, likeById, unlikeById } from 'src/service/ExploreService';
import MainInfo from './MainInfo';

const DEFAULT_LIMIT = '10';

const ExploreSong = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);
  const [songs, setSongs] = useState<GetExploreResponse>();
  const [genre, setGenre] = useState<string>('All');
  const [theme, setTheme] = useState<string>('All');
  const [refresh, setRefresh] = useState<boolean>();
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [tab, setTab] = useState<number>(0);
  const { keyword } = useQuery<{ keyword?: string }>();

  useEffect(() => {
    getExploreSong({
      genre,
      theme,
      limit: DEFAULT_LIMIT,
      offset: String(offset),
      tab,
      keyword,
    }).then((res) => {
      setSongs(res.data);
      setCount(res.paginate.count);
    });
  }, [refresh, offset, genre, theme, tab, keyword]);

  const onLike = (id: string) => (e: MouseEvent<HTMLOrSVGElement>) => {
    e.stopPropagation();
    likeById(id)
      .then(() => setRefresh(!refresh))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  const onUnlike = (id: string) => (e: MouseEvent<HTMLOrSVGElement>) => {
    e.stopPropagation();
    unlikeById(id)
      .then(() => setRefresh(!refresh))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  const handlePaginationChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * Number(DEFAULT_LIMIT));
  };

  return (
    <div className="bg-[#fafafa] px-4 pb-20">
      <div className="flex items-end justify-between">
        <ExploreSearch />
        {isLogin && <NotificationWidget />}
      </div>
      <div className="mb-4 text-xl font-bold">EXPLORE SONGS</div>
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold">Genre</div>
          <Select value={genre} onChange={(v) => setGenre(v)}>
            {[{ name: 'All' }, ...Genre].map((v, i) => (
              <SelectOption key={i} value={v.name}>
                {v.name}
              </SelectOption>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold">Theme</div>
          <Select value={theme} onChange={(v) => setTheme(v)}>
            {[{ name: 'All' }, ...Theme].map((v, i) => (
              <SelectOption key={i} value={v.name}>
                {v.name}
              </SelectOption>
            ))}
          </Select>
        </div>
      </div>
      <Tabs
        labels={['All', 'This Week', 'This Month', 'This Year']}
        onChange={(i) => setTab(i)}
        defaultIndex={0}
      />
      <div>
        {songs?.map((v) => (
          <div
            key={v.id}
            className="flex cursor-pointer items-center p-2 hover:bg-blue/30"
            onClick={() => navigate(`${Page.Explore}/${v.id}`)}
          >
            <div className="flex w-2/5 items-center gap-2">
              <MainInfo coverFileUrl={v.info.coverFileUrl} name={v.info.name} author={v.user} />
            </div>
            <div className="w-1/5">{v.info.genre}</div>
            <div className="w-1/5">{v.info.theme}</div>
            <div className="flex w-1/5 justify-end gap-2">
              <div>
                {isLogin ? (
                  v.like ? (
                    <FavoriteIcon
                      onClick={onUnlike(v.id)}
                      className="cursor-pointer"
                      color="primary"
                      classes={{ colorPrimary: '!text-red' }}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      onClick={onLike(v.id)}
                      className="cursor-pointer hover:text-red"
                    />
                  )
                ) : (
                  <FavoriteBorderIcon color="primary" classes={{ colorPrimary: '!text-grey' }} />
                )}
              </div>
              <div onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                <CopyToClipboard
                  text={`${window.location.origin}${Page.Explore}/${v.id}`}
                  onCopy={() => dispatch(openSuccessSnackbar('Shared link is Copied.'))}
                >
                  <ShareIcon className="cursor-pointer" />
                </CopyToClipboard>
              </div>
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
    </div>
  );
};

export default ExploreSong;
