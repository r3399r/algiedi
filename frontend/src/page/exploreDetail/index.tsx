import AudioFileIcon from '@mui/icons-material/AudioFile';
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
import AudioPlayer from 'src/component/AudioPlayer';
import Avatar from 'src/component/Avatar';
import Button from 'src/component/Button';
import Cover from 'src/component/Cover';
import Divider from 'src/component/Divider';
import ExploreSearch from 'src/component/ExploreSearch';
import FollowButton from 'src/component/FollowButton';
import NotificationWidget from 'src/component/NotificationWidget';
import { Page } from 'src/constant/Page';
import { GetExploreIdResponse } from 'src/model/backend/api/Explore';
import { Type } from 'src/model/backend/constant/Creation';
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
      <div className="ml-10 mr-4 flex items-end justify-between">
        <ExploreSearch />
        {isLogin && <NotificationWidget />}
      </div>
      <div onClick={() => navigate(-1)} className="my-4 ml-10 cursor-pointer">
        {'<Back'}
      </div>
      <div
        className="relative flex h-[200px] items-center bg-blue/30 bg-center"
        style={{
          backgroundImage: creation.info.coverFileUrl ? `url(${creation.info.coverFileUrl})` : '',
        }}
      >
        <div className="ml-10 w-fit rounded-md bg-dark/30 p-4 text-white">
          <div>{creation.info.name}</div>
          <div>{creation.info.genre}</div>
          <div>
            Publish Date:{' '}
            {format(
              new Date(
                (creation.type === Type.Song
                  ? creation.project?.publishedAt
                  : creation.createdAt) ?? '',
              ),
              'yyyy.MM.dd',
            )}
          </div>
          <div className="flex gap-2">
            <FavoriteIcon color="primary" classes={{ colorPrimary: '!text-red' }} />
            <div>{creation.likeCount}</div>
          </div>
        </div>
        {creation.type !== Type.Lyrics && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-1 pb-1 pt-0.5">
            {creation.fileUrl && (
              <AudioPlayer creation={{ ...creation, owner: creation.user[0] }} />
            )}
          </div>
        )}
      </div>
      <div className="mr-10 mt-4 flex justify-end gap-4">
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
      {(creation.tabFileUrl || creation.lyricsText) && (
        <div className="mx-10 mt-10 rounded-3xl border border-solid border-dark p-4">
          {creation.tabFileUrl && (
            <div className="mb-4 flex items-center gap-2">
              <AudioFileIcon
                className="cursor-pointer"
                onClick={() => window.open(creation.tabFileUrl ?? '', '_blank')}
              />
            </div>
          )}
          <div className="mb-4">
            <Accordion disableGutters defaultExpanded sx={{ border: 0 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>Lyrics</AccordionSummary>
              <AccordionDetails>
                <div className="whitespace-pre-line">{creation.lyricsText}</div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      )}
      <div className="flex p-10">
        {creation.type === Type.Song && (
          <div className="flex w-1/2 flex-col gap-3">
            {creation.user.map((v) => (
              <div
                key={v.id}
                className="flex w-fit cursor-pointer items-center gap-5"
                onClick={() => navigate(`${Page.Explore}/user/${v.id}`)}
              >
                <Avatar url={v.avatarUrl} size={80} />
                <div>{v.username}</div>
                <FollowButton
                  id={v.id}
                  following={v.following}
                  doRefresh={() => setRefresh(!refresh)}
                />
              </div>
            ))}
          </div>
        )}
        {creation.type !== Type.Song && (
          <div className="w-1/2">
            <div
              className="flex w-fit cursor-pointer items-center gap-5"
              onClick={() => navigate(`${Page.Explore}/user/${creation.user[0].id}`)}
            >
              <Avatar url={creation.user[0].avatarUrl} size={80} />
              <div>
                <div>{creation.user[0].username}</div>
                <div className="text-sm text-grey">{creation.user[0].role}</div>
              </div>
              <FollowButton
                id={creation.user[0].id}
                following={creation.user[0].following}
                doRefresh={() => setRefresh(!refresh)}
              />
            </div>
          </div>
        )}
        <div className="w-1/2 rounded-3xl border border-solid border-dark p-4">
          <div className="font-bold">Description</div>
          <div className="whitespace-pre-line">{creation.info.description}</div>
        </div>
      </div>
      <div className="mb-4 px-10 text-right">
        <Button
          size="m"
          color="purple"
          onClick={() => navigate(Page.Upload, { state: { inspiration: creation } })}
        >
          {"I'm inspired!"}
        </Button>
      </div>
      <Divider />
      <div className="my-4 flex px-10">
        <div className="w-1/2">
          <div className="mb-4 text-xl font-bold">Inspired By</div>
          <div className="flex flex-wrap gap-4">
            {creation.inspired.map((v) => (
              <div
                key={v.id}
                className="w-fit cursor-pointer text-center"
                onClick={() => navigate(`${Page.Explore}/${v.id}`)}
              >
                <Cover url={v.coverFileUrl} />
                <div className="mt-2 font-bold">{v.info.name}</div>
              </div>
            ))}
          </div>
          {creation.inspired.length === 0 && <div>This is an original</div>}
        </div>
        <div className="w-1/2">
          <div className="mb-4 text-xl font-bold">Inspired</div>
          <div className="flex flex-wrap gap-4">
            {creation.inspiration.map((v) => (
              <div
                key={v.id}
                className="w-fit cursor-pointer text-center"
                onClick={() => navigate(`${Page.Explore}/${v.id}`)}
              >
                <Cover url={v.coverFileUrl} />
                <div className="mt-2 font-bold">{v.info.name}</div>
              </div>
            ))}
          </div>
          {creation.inspiration.length === 0 && <div>Be Ready to Inspire More Uploads!</div>}
        </div>
      </div>
      <Divider />
      <div className="mb-52 mt-4 px-10">
        <div className="mb-4 text-xl font-bold">Comment</div>
        <div className="flex gap-4">
          <div className="flex w-1/2 flex-col gap-4">
            {creation.comments.map((v, i) => (
              <div key={i} className="flex gap-2 rounded-3xl border border-solid border-dark p-4">
                <Avatar url={v.user?.avatarUrl ?? null} size={80} />
                <div className="flex-1">
                  <div className="flex justify-between gap-4">
                    <div className="font-bold">{v.user?.username}</div>
                    <div className="text-grey">
                      {v.timestamp ? formatDistanceToNow(new Date(v.timestamp)) : ''}
                    </div>
                  </div>
                  <div className="whitespace-pre-line">{v.comment}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-1/2">
            <textarea
              className="h-[200px] w-full rounded border border-black px-2"
              value={isLogin ? myComment : 'Please login to comment'}
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
