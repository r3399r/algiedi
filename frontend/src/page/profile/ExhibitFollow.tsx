import { Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import { Page } from 'src/constant/Page';
import { GetMeExhibitsFollowResponse } from 'src/model/backend/api/Me';
import { getFollows } from 'src/service/ProfileService';

const DEFAULT_LIMIT = '10';

const ExhibitFollow = () => {
  const navigate = useNavigate();
  const [original, setOriginal] = useState<GetMeExhibitsFollowResponse>();
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    getFollows(DEFAULT_LIMIT, String(offset)).then((res) => {
      setOriginal(res.data);
      setCount(res.paginate.count);
    });
  }, [offset]);

  const handlePaginationChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * Number(DEFAULT_LIMIT));
  };

  if (!original) return <>Loading...</>;
  if (original.length === 0) return <>There is no Following.</>;

  return (
    <div>
      <div className="flex flex-wrap gap-6">
        {original.map((v) => (
          <div
            key={v.id}
            className="cursor-pointer text-center"
            onClick={() => navigate(`${Page.Explore}/user/${v.followeeId}`)}
          >
            <Cover url={v.followee.avatarUrl} size={150} />
            <div className="font-bold">{v.followee.username}</div>
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

export default ExhibitFollow;
