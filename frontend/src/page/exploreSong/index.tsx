import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import { Page } from 'src/constant/Page';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { getExplore } from 'src/service/ExploreService';

const ExploreSong = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as GetExploreResponse;
  const [songs, setSongs] = useState<GetExploreResponse>();

  useEffect(() => {
    if (state === null) getExplore().then((res) => setSongs(res.songs));
    else setSongs(state);
  }, [state]);

  return (
    <div className="mx-4 bg-[#fafafa]">
      <div className="mb-4 text-xl font-bold">EXPLORE SONGS</div>
      <div>
        {songs?.map((v) => (
          <div
            key={v.id}
            className="flex cursor-pointer p-2 hover:bg-blue/30"
            onClick={() => navigate(`${Page.Explore}/${v.id}`)}
          >
            <div className="flex items-center gap-2">
              <Cover url={v.coverFileUrl} size={50} />
              <div>
                <div className="font-bold">{v.name}</div>
                <div className="text-sm text-grey">
                  Authors: {v.author.map((o) => o.username).join()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreSong;
