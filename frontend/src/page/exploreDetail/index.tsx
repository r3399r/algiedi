import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'src/component/Button';
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
      <div onClick={() => navigate(-1)}>Back</div>
      <div
        className="bg-gray-400 bg-center h-[200px]"
        style={{ backgroundImage: creation.coverFileUrl ? `url(${creation.coverFileUrl})` : '' }}
      >
        <div className="p-10">
          <div>{creation.name}</div>
          <div>{creation.genre}</div>
          <div>Publish Date: {format(new Date(creation.createdAt ?? ''), 'yyyy.MM.dd')}</div>
        </div>
      </div>
      <div className="flex p-10">
        <div className="w-1/2 flex gap-5">
          <img src={IcProfile} />
          <div>
            <div>{creation.username}</div>
            <div>{creation.user.role}</div>
          </div>
        </div>
        <div className="w-1/2">
          <div className="font-bold">Description:</div>
          <div>{creation.description}</div>
        </div>
      </div>
      <div className="text-right px-10">
        <Button onClick={() => navigate(Page.Upload, { state: { inspiredId: creation.id } })}>
          {"I'm inspired!"}
        </Button>
      </div>
      <div className="flex px-10">
        <div className="w-1/2">
          <div className="font-bold">Inspired By</div>
          {creation.inspired && (
            <div
              className="cursor-pointer"
              onClick={() => navigate(`${Page.Explore}/${creation.inspired?.id}`)}
            >
              {creation.inspired.name}
            </div>
          )}
          {!creation.inspired && <div>This is an original</div>}
        </div>
        <div className="w-1/2">
          <div className="font-bold">Inspired</div>
          {creation.inspiration.map((v) => (
            <div
              key={v.id}
              className="cursor-pointer"
              onClick={() => navigate(`${Page.Explore}/${v.id}`)}
            >
              {v.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ExploreDetail;
