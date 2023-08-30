import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import Tabs from 'src/component/Tabs';
import { Page } from 'src/constant/Page';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { getExplores } from 'src/service/ProfileService';

const Exhibits = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<number>(0);
  const [published, setPublished] = useState<GetExploreResponse>([]);
  const [original, setOriginal] = useState<GetExploreResponse>([]);
  const [inspiration, setInspiration] = useState<GetExploreResponse>([]);

  useEffect(() => {
    getExplores().then((res) => {
      setPublished(res.published);
      setOriginal(res.original);
      setInspiration(res.inspiration);
    });
  }, []);

  return (
    <>
      <div className="mb-4">
        <Tabs
          labels={['Published', 'Original', 'Inspiration', 'Likes', 'Following']}
          onChange={(i) => setTab(i)}
          defaultIndex={0}
        />
      </div>
      {tab === 0 && (
        <div className="flex flex-wrap gap-6">
          {published.length > 0
            ? published.map((v) => (
                <div
                  key={v.id}
                  className="cursor-pointer text-center"
                  onClick={() => navigate(`${Page.Explore}/${v.id}`)}
                >
                  <Cover url={v.coverFileUrl} size={150} />
                  <div className="font-bold">{v.name}</div>
                </div>
              ))
            : 'There is no published song.'}
        </div>
      )}
      {tab === 1 && (
        <div className="flex flex-wrap gap-6">
          {original.length > 0
            ? original.map((v) => (
                <div
                  key={v.id}
                  className="cursor-pointer text-center"
                  onClick={() => navigate(`${Page.Explore}/${v.id}`)}
                >
                  <Cover url={v.coverFileUrl} size={150} />
                  <div className="font-bold">{v.name}</div>
                </div>
              ))
            : 'There is no original creation.'}
        </div>
      )}
      {tab === 2 && (
        <div className="flex flex-wrap gap-6">
          {inspiration.length > 0
            ? inspiration.map((v) => (
                <div
                  key={v.id}
                  className="cursor-pointer text-center"
                  onClick={() => navigate(`${Page.Explore}/${v.id}`)}
                >
                  <Cover url={v.coverFileUrl} size={150} />
                  <div className="font-bold">{v.name}</div>
                </div>
              ))
            : 'There is no inspiration creation.'}
        </div>
      )}
    </>
  );
};

export default Exhibits;
