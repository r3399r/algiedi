import { Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import CoverInfo from 'src/component/CoverInfo';
import { Page } from 'src/constant/Page';
import { GetMeExhibitsPublishedResponse } from 'src/model/backend/api/Me';
import { getPublished } from 'src/service/ProfileService';

type Props = {
  countPerPage: string;
};

const ExhibitPublish = ({ countPerPage }: Props) => {
  const [published, setPublished] = useState<GetMeExhibitsPublishedResponse>();
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    getPublished(countPerPage, String(offset)).then((res) => {
      setPublished(res.data);
      setCount(res.paginate.count);
    });
  }, [offset]);

  const handlePaginationChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * Number(countPerPage));
  };

  if (!published) return <>Loading...</>;
  if (published.length === 0) return <>There is no published song.</>;

  return (
    <div>
      <div className="flex flex-wrap gap-6">
        {published.map((v) => (
          <CoverInfo creation={v} size={150} key={v.id} navigateTo={`${Page.Explore}/${v.id}`} />
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

export default ExhibitPublish;
