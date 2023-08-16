import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import { Page } from 'src/constant/Page';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { RootState } from 'src/redux/store';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { getExplore, likeById, unlikeById } from 'src/service/ExploreService';

const ExploreSong = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);
  const state = location.state as GetExploreResponse;
  const [songs, setSongs] = useState<GetExploreResponse>();
  const [refresh, setRefresh] = useState<boolean>();

  useEffect(() => {
    if (refresh !== undefined || state === null) getExplore().then((res) => setSongs(res.songs));
    else setSongs(state);
  }, [state, refresh]);

  const onLike = (id: string) => () => {
    likeById(id)
      .then(() => setRefresh(!refresh))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  const onUnlike = (id: string) => () => {
    unlikeById(id)
      .then(() => setRefresh(!refresh))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <div className="mx-4 bg-[#fafafa]">
      <div className="mb-4 text-xl font-bold">EXPLORE SONGS</div>
      <div>
        {songs?.map((v) => (
          <div key={v.id} className="flex items-center p-2">
            <div
              className="flex w-1/2 cursor-pointer items-center gap-2 hover:bg-blue/30"
              onClick={() => navigate(`${Page.Explore}/${v.id}`)}
            >
              <Cover url={v.coverFileUrl} size={50} />
              <div>
                <div className="font-bold">{v.name}</div>
                <div className="text-sm text-grey">{v.author.map((o) => o.username).join()}</div>
              </div>
            </div>
            <div className="w-1/4">{v.genre}</div>
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
              <div>
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
    </div>
  );
};

export default ExploreSong;
