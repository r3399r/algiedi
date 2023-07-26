import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'src/component/Button';
import Cover from 'src/component/Cover';
import Divider from 'src/component/Divider';
import { Page } from 'src/constant/Page';
import IcProfile from 'src/image/ic-profile.svg';
import { GetExploreIdResponse } from 'src/model/backend/api/Explore';
import { RootState } from 'src/redux/store';
import { openFailSnackbar, openSuccessSnackbar } from 'src/redux/uiSlice';
import { commentById, getExploreById, likeById, unlikeById } from 'src/service/ExploreService';

const ExploreDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);
  const { id } = useParams();
  const [creation, setCreation] = useState<GetExploreIdResponse>();
  const [myComment, setMyComment] = useState<string>('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (id === undefined) return;
    getExploreById(id)
      .then((res) => setCreation(res))
      .catch((err) => dispatch(openFailSnackbar(err)));
  }, [id, refresh]);

  const onLike = () => {
    if (id === undefined) return;
    likeById(id)
      .then(() => setRefresh(!refresh))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  const onUnlike = () => {
    if (id === undefined) return;
    unlikeById(id)
      .then(() => setRefresh(!refresh))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  const onComment = () => {
    if (id === undefined || myComment === '') return;
    commentById(id, myComment)
      .then(() => setRefresh(!refresh))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  if (!creation) return <>loading...</>;

  return (
    <>
      <div onClick={() => navigate(-1)} className="ml-10 my-4">
        Back
      </div>
      <div
        className="bg-blue/30 bg-center h-[200px] flex items-center"
        style={{ backgroundImage: creation.coverFileUrl ? `url(${creation.coverFileUrl})` : '' }}
      >
        <div className="ml-10 p-4 bg-dark/30 w-fit rounded-md text-white">
          <div>{creation.name}</div>
          <div>{creation.genre}</div>
          <div>Publish Date: {format(new Date(creation.createdAt ?? ''), 'yyyy.MM.dd')}</div>
          <div className="flex gap-2">
            <FavoriteIcon color="primary" classes={{ colorPrimary: '!text-red' }} />
            <div>{creation.likeCount}</div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 justify-end mr-10 mt-4">
        {isLogin ? (
          creation.like ? (
            <FavoriteIcon
              onClick={onUnlike}
              className="cursor-pointer"
              color="primary"
              classes={{ colorPrimary: '!text-red' }}
            />
          ) : (
            <FavoriteBorderIcon onClick={onLike} className="cursor-pointer" />
          )
        ) : (
          <FavoriteBorderIcon color="primary" classes={{ colorPrimary: '!text-grey' }} />
        )}
        <CopyToClipboard
          text={location.href}
          onCopy={() => dispatch(openSuccessSnackbar('Shared link is Copied.'))}
        >
          <ShareIcon className="cursor-pointer" />
        </CopyToClipboard>
      </div>
      <div className="p-4 border border-solid border-dark rounded-3xl mx-10 mt-10">
        {creation.fileUrl && (
          <div className="flex items-center mb-4 gap-2">
            <audio src={creation.fileUrl} controls />
            {creation.tabFileUrl && (
              <DownloadForOfflineIcon
                className="cursor-pointer"
                onClick={() => window.open(creation.tabFileUrl ?? '', '_blank')}
              />
            )}
          </div>
        )}
        {creation.lyricsText && (
          <div className="mb-4">
            <Accordion disableGutters defaultExpanded sx={{ border: 0 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>Lyrics</AccordionSummary>
              <AccordionDetails>
                <div className="whitespace-pre">{creation.lyricsText}</div>
              </AccordionDetails>
            </Accordion>
          </div>
        )}
      </div>
      <div className="flex p-10">
        {creation.type === 'song' && (
          <div className="w-1/2 flex flex-col gap-3">
            {creation.inspired.map((v) => (
              <div key={v.id} className="flex gap-5 items-center">
                <img src={IcProfile} />
                <div>{v.username}</div>
                <div>
                  <Button size="s">Follow</Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {creation.type !== 'song' && (
          <div className="w-1/2 flex gap-5 items-center">
            <img src={IcProfile} />
            <div>
              <div>{creation.username}</div>
              <div className="text-sm text-grey">{creation.user.role}</div>
            </div>
            <div>
              <Button size="s">Follow</Button>
            </div>
          </div>
        )}
        <div className="w-1/2 border border-solid border-dark rounded-3xl p-4">
          <div className="font-bold">Description</div>
          <div className="whitespace-pre">{creation.description}</div>
        </div>
      </div>
      <div className="text-right px-10 mb-4">
        <Button
          size="m"
          color="purple"
          onClick={() => navigate(Page.Upload, { state: { inspiredId: creation.id } })}
        >
          {"I'm inspired!"}
        </Button>
      </div>
      <Divider />
      <div className="flex px-10 my-4">
        <div className="w-1/2">
          <div className="font-bold text-xl mb-4">Inspired By</div>
          <div className="flex gap-4 flex-wrap">
            {creation.inspired.map((v) => (
              <div
                key={v.id}
                className="cursor-pointer w-fit text-center"
                onClick={() => navigate(`${Page.Explore}/${v.id}`)}
              >
                <Cover url={v.coverFileUrl} />
                <div className="mt-2 font-bold">{v.name}</div>
              </div>
            ))}
          </div>
          {creation.inspired.length === 0 && <div>This is an original</div>}
        </div>
        <div className="w-1/2">
          <div className="font-bold text-xl mb-4">Inspired</div>
          <div className="flex gap-4 flex-wrap">
            {creation.inspiration.map((v) => (
              <div
                key={v.id}
                className="cursor-pointer w-fit text-center"
                onClick={() => navigate(`${Page.Explore}/${v.id}`)}
              >
                <Cover url={v.coverFileUrl} />
                <div className="mt-2 font-bold">{v.name}</div>
              </div>
            ))}
          </div>
          {creation.inspiration.length === 0 && <div>Be Ready to Inspire More Uploads!</div>}
        </div>
      </div>
      <Divider />
      <div className="px-10 my-4">
        <div className="font-bold text-xl mb-4">Comment</div>
        <div className="flex gap-4">
          <div className="w-1/2 flex flex-col gap-4">
            {creation.comments.map((v, i) => (
              <div key={i} className="border border-solid border-dark rounded-3xl flex p-4 gap-2">
                <img src={IcProfile} />
                <div className="flex-1">
                  <div className="flex gap-4 justify-between">
                    <div className="font-bold">{v.user?.username}</div>
                    <div className="text-grey">
                      {v.timestamp ? formatDistanceToNow(new Date(v.timestamp)) : ''}
                    </div>
                  </div>
                  <div className="whitespace-pre">{v.comment}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-1/2">
            <textarea
              className="w-full border-[1px] border-black px-2 rounded h-[200px]"
              value={myComment}
              onChange={(e) => setMyComment(e.target.value)}
              disabled={!isLogin}
            />
            <div className="text-right">
              <Button size="s" color="transparent" onClick={onComment} disabled={!isLogin}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreDetail;
