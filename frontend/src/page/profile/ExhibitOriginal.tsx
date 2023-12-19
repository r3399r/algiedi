import { Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import CoverInfo from 'src/component/CoverInfo';
import Select from 'src/component/Select';
import SelectOption from 'src/component/SelectOption';
import { Page } from 'src/constant/Page';
import { GetMeExhibitsOriginalResponse } from 'src/model/backend/api/Me';
import { Type } from 'src/model/backend/constant/Creation';
import { getOriginal } from 'src/service/ProfileService';

type Props = {
  countPerPage: string;
};

const ExhibitOriginal = ({ countPerPage }: Props) => {
  const [original, setOriginal] = useState<GetMeExhibitsOriginalResponse>();
  const [filter, setFilter] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    getOriginal(filter, countPerPage, String(offset)).then((res) => {
      setOriginal(res.data);
      setCount(res.paginate.count);
    });
  }, [offset, filter]);

  const handlePaginationChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * Number(countPerPage));
  };

  if (!original) return <>Loading...</>;
  if (original.length === 0) return <>There is no original track/lyrics.</>;

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center gap-1">
        <div className="text-lg font-bold">Filter:</div>
        <Select value={filter} onChange={(v) => setFilter(v)}>
          <SelectOption value="All">All</SelectOption>
          <SelectOption value={Type.Track}>Track</SelectOption>
          <SelectOption value={Type.Lyrics}>Lyrics</SelectOption>
        </Select>
      </div>
      <div className="flex flex-wrap gap-6">
        {original.map((v) => (
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

export default ExhibitOriginal;
