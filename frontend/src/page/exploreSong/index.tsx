import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { Pagination } from '@mui/material';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import { Page } from 'src/constant/Page';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { RootState } from 'src/redux/store';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { getExploreSong, likeById, unlikeById } from 'src/service/ExploreService';

const DEFAULT_LIMIT = '10';

const ExploreSong = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);
  const [songs, setSongs] = useState<GetExploreResponse>();
  const [refresh, setRefresh] = useState<boolean>();
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    getExploreSong(DEFAULT_LIMIT, String(offset)).then((res) => {
      setSongs(res.data);
      setCount(res.paginate.count);
    });
  }, [refresh, offset]);

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
      <div className="mb-4 text-xl font-bold">EXPLORE SONGS</div>
      <div>
        {songs?.map((v) => (
          <div
            key={v.id}
            className="flex cursor-pointer items-center p-2 hover:bg-blue/30"
            onClick={() => navigate(`${Page.Explore}/${v.id}`)}
          >
            <div className="flex w-1/2 items-center gap-2">
              <Cover url={v.info.coverFileUrl} size={50} />
              <div>
                <div className="font-bold">{v.info.name}</div>
                <div className="text-sm text-grey">{`${
                  v.user.length > 0 ? v.user[0].username : ''
                }${v.user.length > 1 ? ` & ${v.user.length - 1} others` : ''}`}</div>
              </div>
            </div>
            <div className="w-1/4">{v.info.genre}</div>
            <div className="flex w-1/4 justify-end gap-2">
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

export default ExploreSong;
