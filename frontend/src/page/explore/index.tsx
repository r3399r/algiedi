import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import { DetailedCreation } from 'src/model/backend/Project';
import { getExplore } from 'src/service/ExploreService';

const Explore = () => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<DetailedCreation[]>();
  const [lyrics, setLyrics] = useState<DetailedCreation[]>();
  const [songs, setSongs] = useState<DetailedCreation[]>();

  useEffect(() => {
    getExplore().then((res) => {
      setTracks(res.tracks);
      setLyrics(res.lyrics);
      setSongs(res.songs);
    });
  }, []);

  return (
    <div className="bg-[#fafafa] mx-4">
      <div className="font-bold text-xl mb-4">FEATURED SONGS</div>
      <div className="w-full overflow-x-auto">
        <div className="flex mb-6 gap-4">
          {songs?.map((v) => (
            <div
              key={v.id}
              className="text-center w-[150px] flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => navigate(v.id)}
            >
              <Cover url={v.coverFileUrl} size={150} />
              <div className="font-bold">{v.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="w-1/2">
          <div className="font-bold text-xl mb-4">Music</div>
          {/* <div className="flex gap-4">
            <div>This week</div>
            <div>This month</div>
            <div>Last month</div>
          </div> */}
          <div className="flex flex-col gap-4">
            {tracks?.map((v) => (
              <div
                key={v.id}
                className="flex p-4 bg-white rounded-lg cursor-pointer"
                onClick={() => navigate(v.id)}
              >
                <Cover url={v.coverFileUrl} size={120} />
                <div className="m-4 flex flex-col justify-center">
                  <div className="text-bold">{v.name}</div>
                  <div className="text-gray-500">by {v.username}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2">
          <div className="font-bold text-xl mb-4">Lyrics</div>
          {/* <div className="flex gap-4">
            <div>This week</div>
            <div>This month</div>
            <div>Last month</div>
          </div> */}
          <div className="flex flex-col gap-4">
            {lyrics?.map((v) => (
              <div
                key={v.id}
                className="flex p-4 bg-white rounded-lg cursor-pointer"
                onClick={() => navigate(v.id)}
              >
                <Cover url={v.coverFileUrl} size={120} />
                <div className="m-4 flex flex-col justify-center">
                  <div className="text-bold">{v.name}</div>
                  <div className="text-gray-500">by {v.username}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
