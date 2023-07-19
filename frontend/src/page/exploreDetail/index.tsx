import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'src/component/Button';
import Cover from 'src/component/Cover';
import Divider from 'src/component/Divider';
import { Page } from 'src/constant/Page';
import IcProfile from 'src/image/ic-profile.svg';
import { GetExploreIdResponse } from 'src/model/backend/api/Explore';
import { getExploreById } from 'src/service/ExploreService';

const ExploreDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [creation, setCreation] = useState<GetExploreIdResponse>();

  useEffect(() => {
    if (id === undefined) return;
    getExploreById(id).then((res) => setCreation(res));
  }, [id]);

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
        <div className="ml-10 p-2 bg-grey/70 w-fit rounded-md">
          <div>{creation.name}</div>
          <div>{creation.genre}</div>
          <div>Publish Date: {format(new Date(creation.createdAt ?? ''), 'yyyy.MM.dd')}</div>
        </div>
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
        <div className="w-1/2 flex gap-5">
          <img src={IcProfile} />
          <div>
            <div>{creation.username}</div>
            <div>{creation.user.role}</div>
          </div>
        </div>
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
          {creation.inspired && (
            <div
              className="cursor-pointer w-fit text-center"
              onClick={() => navigate(`${Page.Explore}/${creation.inspired?.id}`)}
            >
              <Cover url={creation.inspired.coverFileUrl} />
              <div className="mt-2 font-bold">{creation.inspired.name}</div>
            </div>
          )}
          {!creation.inspired && <div>This is an original</div>}
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
    </>
  );
};

export default ExploreDetail;
