import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ShareIcon from '@mui/icons-material/Share';
import { Pagination } from '@mui/material';
import classNames from 'classnames';
import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import Select from 'src/component/Select';
import SelectOption from 'src/component/SelectOption';
import Tabs from 'src/component/Tabs';
import { Page } from 'src/constant/Page';
import { Genre, Theme } from 'src/constant/Property';
import useQuery from 'src/hook/useQuery';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { Type } from 'src/model/backend/constant/Creation';
import { Status } from 'src/model/backend/constant/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { getExploreIdea, likeById, unlikeById } from 'src/service/ExploreService';

const DEFAULT_LIMIT = '10';

const statusMapping = {
  created: 'Join me',
  'in-progress': 'In Progress',
  published: 'Published',
  independent: 'Independent',
};

const ExploreIdea = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const query = useQuery<{ tab: string }>();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);
  const [idea, setIdea] = useState<GetExploreResponse>();
  const [genre, setGenre] = useState<string>('All');
  const [theme, setTheme] = useState<string>('All');
  const [status, setStatus] = useState<Status | 'All' | 'Null'>('All');
  const [refresh, setRefresh] = useState<boolean>();
  const [tab, setTab] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const type = useMemo(() => {
    setOffset(0);
    setPage(1);
    if (tab === 0) return [Type.Track];
    if (tab === 1) return [Type.Lyrics];
    if (tab === 2) return [Type.Track, Type.Lyrics];
  }, [tab]);

  useEffect(() => {
    if (query.tab === 'lyrics') setTab(1);
    else if (query.tab === 'all') setTab(2);
    else setTab(0);
  }, [query.tab]);

  useEffect(() => {
    if (!type) return;
    getExploreIdea({
      type,
      genre,
      theme,
      limit: DEFAULT_LIMIT,
      offset: String(offset),
      status,
    }).then((res) => {
      setIdea(res.data);
      setCount(res.paginate.count);
    });
  }, [type, refresh, offset, genre, theme, status]);

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
    <div className="mx-4 bg-[#fafafa]">
      <div className="mb-4 text-xl font-bold">EXPLORE IDEA</div>
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
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold">Status</div>
          <Select value={status} onChange={(v) => setStatus(v as Status | 'All' | 'Null')}>
            <SelectOption value={'All'}>All</SelectOption>
            <SelectOption value={Status.Created}>Join me</SelectOption>
            <SelectOption value={Status.InProgress}>In Progress</SelectOption>
            <SelectOption value={Status.Published}>Published</SelectOption>
            <SelectOption value={'Null'}>Independent</SelectOption>
          </Select>
        </div>
      </div>
      {tab !== undefined && (
        <Tabs
          labels={['Tracks', 'Lyrics', 'All']}
          onChange={(i) => navigate(`?tab=${['track', 'lyrics', 'all'][i]}`)}
          defaultIndex={tab}
        />
      )}
      <div className="mt-4 flex flex-wrap gap-6">
        {idea?.map((v) => (
          <div
            key={v.id}
            className="relative flex w-[calc(50%-12px)] cursor-pointer items-center gap-2 rounded-xl bg-white p-4 hover:bg-blue/30"
            onClick={() => navigate(`${Page.Explore}/${v.id}`)}
          >
            <div className="flex w-1/3 flex-col items-center">
              <Cover url={v.info.coverFileUrl} size={50} />
              <div className="flex">
                {v.type === Type.Track ? (
                  <MusicNoteIcon
                    color="primary"
                    classes={{ colorPrimary: '!text-blue' }}
                    fontSize="small"
                  />
                ) : (
                  <HistoryEduIcon
                    color="primary"
                    classes={{ colorPrimary: '!text-red' }}
                    fontSize="small"
                  />
                )}
                <div className="text-sm text-grey">{v.user.map((o) => o.username).join()}</div>
              </div>
            </div>
            <div className="w-1/2">
              <div className="font-bold">{v.info.name}</div>
              <div className="flex gap-1">
                <div className="my-2 w-fit rounded-xl border border-black bg-white px-1 text-xs">
                  {v.info.genre}
                </div>
                <div className="my-2 w-fit rounded-xl border border-black bg-white px-1 text-xs">
                  {v.info.theme}
                </div>
              </div>
              <div className="text-xs">{v.info.description}</div>
            </div>
            <div
              className={classNames('absolute right-4 top-4 text-xs font-bold', {
                'text-blue': v.project?.status === 'created',
              })}
            >
              {statusMapping[v.project?.status ?? 'independent']}
            </div>
            <div className="absolute bottom-4 right-4 flex">
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
                    <FavoriteBorderIcon onClick={onLike(v.id)} className="cursor-pointer" />
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

export default ExploreIdea;
