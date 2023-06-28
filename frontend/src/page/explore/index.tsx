import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IcProfile from 'src/image/ic-profile.svg';
import PicSample1 from 'src/image/sample1.png';
import { DetailedCreation } from 'src/model/backend/Project';
import { getExplore } from 'src/service/ExploreService';

const Explore = () => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<DetailedCreation[]>();
  const [lyrics, setLyrics] = useState<DetailedCreation[]>();

  useEffect(() => {
    getExplore().then((res) => {
      setTracks(res.tracks);
      setLyrics(res.lyrics);
    });
  }, []);

  return (
    <div className="bg-[#fafafa]">
      <div className="font-bold ml-4">FEATURED SONGS</div>
      <div className="w-full overflow-x-auto">
        <div className="flex mb-6">
          <div className="text-center w-[200px] flex-shrink-0">
            <img src={PicSample1} />
            <div>Song name</div>
            <div>by artist</div>
          </div>
          <div className="text-center w-[200px] flex-shrink-0">
            <img src={PicSample1} />
            <div>Song name</div>
            <div>by artist</div>
          </div>
          <div className="text-center w-[200px] flex-shrink-0">
            <img src={PicSample1} />
            <div>Song name</div>
            <div>by artist</div>
          </div>
          <div className="text-center w-[200px] flex-shrink-0">
            <img src={PicSample1} />
            <div>Song name</div>
            <div>by artist</div>
          </div>
          <div className="text-center w-[200px] flex-shrink-0">
            <img src={PicSample1} />
            <div>Song name</div>
            <div>by artist</div>
          </div>
          <div className="text-center w-[200px] flex-shrink-0">
            <img src={PicSample1} />
            <div>Song name</div>
            <div>by artist</div>
          </div>
          <div className="text-center w-[200px] flex-shrink-0">
            <img src={PicSample1} />
            <div>Song name</div>
            <div>by artist</div>
          </div>
          <div className="text-center w-[200px] flex-shrink-0">
            <img src={PicSample1} />
            <div>Song name</div>
            <div>by artist</div>
          </div>
          <div className="text-center w-[200px] flex-shrink-0">
            <img src={PicSample1} />
            <div>Song name</div>
            <div>by artist</div>
          </div>
          <div className="text-center w-[200px] flex-shrink-0">
            <img src={PicSample1} />
            <div>Song name</div>
            <div>by artist</div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 mt-4 mx-4">
          <div className="font-bold">Music</div>
          <div className="flex gap-4">
            <div>This week</div>
            <div>This month</div>
            <div>Last month</div>
          </div>
          {tracks?.map((v) => (
            <div
              key={v.id}
              className="flex p-4 bg-white rounded-lg mt-4 cursor-pointer"
              onClick={() => navigate(v.id)}
            >
              <img src={v.coverFileUrl ?? IcProfile} className="w-[150px]" />
              <div className="m-4 flex flex-col justify-center">
                <div className="text-bold">{v.name}</div>
                <div className="text-gray-500">by {v.username}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-1/2 mt-4 mx-4">
          <div className="font-bold">Lyrics</div>
          <div className="flex gap-4">
            <div>This week</div>
            <div>This month</div>
            <div>Last month</div>
          </div>
          {lyrics?.map((v) => (
            <div
              key={v.id}
              className="flex p-4 bg-white rounded-lg mt-4 cursor-pointer"
              onClick={() => navigate(v.id)}
            >
              <img src={v.coverFileUrl ?? IcProfile} className="w-[150px]" />
              <div className="m-4 flex flex-col justify-center">
                <div className="text-bold">{v.name}</div>
                <div className="text-gray-500">by {v.username}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
