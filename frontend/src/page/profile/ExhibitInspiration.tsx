import { Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import Select from 'src/component/Select';
import SelectOption from 'src/component/SelectOption';
import { Page } from 'src/constant/Page';
import { GetMeExhibitsInspirationResponse } from 'src/model/backend/api/Me';
import { Type } from 'src/model/backend/constant/Creation';
import { getInspiration } from 'src/service/ProfileService';

type Props = {
  countPerPage: string;
};

const ExhibitInspiration = ({ countPerPage }: Props) => {
  const navigate = useNavigate();
  const [inspiration, setInspiration] = useState<GetMeExhibitsInspirationResponse>();
  const [filter, setFilter] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    getInspiration(filter, countPerPage, String(offset)).then((res) => {
      setInspiration(res.data);
      setCount(res.paginate.count);
    });
  }, [offset, filter]);

  const handlePaginationChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * Number(countPerPage));
  };

  if (!inspiration) return <>Loading...</>;
  if (inspiration.length === 0) return <>There is no inspired track/lyrics.</>;

  return (
    <div>
      <div className="mb-10 flex items-center gap-1">
        <div className="text-lg font-bold">Filter:</div>
        <Select value={filter} onChange={(v) => setFilter(v)}>
          <SelectOption value="All">All</SelectOption>
          <SelectOption value={Type.Track}>Track</SelectOption>
          <SelectOption value={Type.Lyrics}>Lyrics</SelectOption>
        </Select>
      </div>
      <div className="flex flex-wrap gap-6">
        {inspiration.map((v) => (
          <div
            key={v.id}
            className="flex cursor-pointer flex-col items-center"
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

export default ExhibitInspiration;
