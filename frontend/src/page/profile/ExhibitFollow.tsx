import { Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import Select from 'src/component/Select';
import SelectOption from 'src/component/SelectOption';
import { Page } from 'src/constant/Page';
import { Role } from 'src/constant/Property';
import { GetMeExhibitsFollowResponse } from 'src/model/backend/api/Me';
import { getFollows } from 'src/service/ProfileService';

type Props = {
  countPerPage: string;
};

const ExhibitFollow = ({ countPerPage }: Props) => {
  const navigate = useNavigate();
  const [followee, setFollowee] = useState<GetMeExhibitsFollowResponse>();
  const [filter, setFilter] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    getFollows(filter, countPerPage, String(offset)).then((res) => {
      setFollowee(res.data);
      setCount(res.paginate.count);
    });
  }, [offset, filter]);

  const handlePaginationChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * Number(countPerPage));
  };

  if (!followee) return <>Loading...</>;
  if (followee.length === 0) return <>There is no Following.</>;

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center gap-1">
        <div className="text-lg font-bold">Filter:</div>
        <Select value={filter} onChange={(v) => setFilter(v)}>
          {['All', ...Role.map((v) => v.name)].map((v, i) => (
            <SelectOption key={i} value={v}>
              {v}
            </SelectOption>
          ))}
        </Select>
      </div>
      <div className="flex flex-wrap gap-6">
        {followee.map((v) => (
          <div
            key={v.id}
            className="flex cursor-pointer flex-col items-center"
            onClick={() => navigate(`${Page.Explore}/user/${v.followeeId}`)}
          >
            <Cover url={v.followee.avatarUrl} size={150} type="user" />
            <div className="font-bold">{v.followee.username}</div>
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

export default ExhibitFollow;
