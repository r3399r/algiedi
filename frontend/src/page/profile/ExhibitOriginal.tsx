import { Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import { Page } from 'src/constant/Page';
import { GetMeExhibitsOriginalResponse } from 'src/model/backend/api/Me';
import { getOriginal } from 'src/service/ProfileService';

type Props = {
  countPerPage: string;
};

const ExhibitOriginal = ({ countPerPage }: Props) => {
  const navigate = useNavigate();
  const [original, setOriginal] = useState<GetMeExhibitsOriginalResponse>();
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    getOriginal(countPerPage, String(offset)).then((res) => {
      setOriginal(res.data);
      setCount(res.paginate.count);
    });
  }, [offset]);

  const handlePaginationChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * Number(countPerPage));
  };

  if (!original) return <>Loading...</>;
  if (original.length === 0) return <>There is no original track/lyrics.</>;

  return (
    <div>
      <div className="flex flex-wrap gap-6">
        {original.map((v) => (
          <div
            key={v.id}
            className="cursor-pointer text-center"
            onClick={() => navigate(`${Page.Explore}/${v.id}`)}
          >
            <Cover url={v.info.coverFileUrl} size={150} />
            <div className="font-bold">{v.info.name}</div>
          </div>
        ))}
      </div>
      <div className="my-4 flex justify-center">
        <Pagination
          count={Math.ceil(count / Number(countPerPage))}
          page={page}
          onChange={handlePaginationChange}
        />
      </div>
    </div>
  );
};

export default ExhibitOriginal;
