import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ShareIcon from '@mui/icons-material/Share';
import classNames from 'classnames';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import Tabs from 'src/component/Tabs';
import { Page } from 'src/constant/Page';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { Type } from 'src/model/backend/constant/Creation';
import { RootState } from 'src/redux/store';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { getExplore, getExploreIdea, likeById, unlikeById } from 'src/service/ExploreService';

const ExploreIdea = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);
  const [idea, setIdea] = useState<GetExploreResponse>();
  const [refresh, setRefresh] = useState<boolean>();
  const [tab, setTab] = useState<number>(0);

  const type = useMemo(() => {
    if (tab === 0) return [Type.Track];
    if (tab === 1) return [Type.Lyrics];

    return [Type.Track, Type.Lyrics]; // all
  }, [tab]);

  useEffect(() => {
    getExploreIdea(type, '10', '5').then((res) => setIdea(res.data));
  }, [type, refresh]);

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

  return (
    <div className="mx-4 bg-[#fafafa]">
      <div className="mb-4 text-xl font-bold">EXPLORE IDEA</div>
      <Tabs labels={['Tracks', 'Lyrics', 'All']} onChange={(i) => setTab(i)} defaultIndex={0} />
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
                {Number(v.type) === Type.Track ? (
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
              <div className="my-2 w-fit rounded-xl border border-black bg-white p-1 text-xs">
                {v.info.genre}
              </div>
              <div className="text-xs">{v.info.description}</div>
            </div>
            <div
              className={classNames('absolute right-4 top-4 text-xs font-bold', {
                'text-blue': v.project?.status === 'created',
              })}
            >
              {v.project
                ? v.project?.status === 'created'
                  ? 'Join me'
                  : v.project?.status === 'in-progress'
                  ? 'In progress'
                  : 'Published'
                : 'Independent'}
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
    </div>
  );
};

export default ExploreIdea;
