import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
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
    <div className="mx-4 bg-[#fafafa]">
      <div className="mb-4 flex items-center gap-4">
        <div className="text-xl font-bold">FEATURED SONGS</div>
        <Button size="s" color="transparent" onClick={() => navigate('song', { state: songs })}>
          More Songs
        </Button>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="mb-6 flex gap-4">
          {songs?.map((v) => (
            <div
              key={v.id}
              className="flex w-[150px] shrink-0 cursor-pointer flex-col items-center gap-2 text-center"
              onClick={() => navigate(v.id)}
            >
              <Cover url={v.coverFileUrl} size={150} />
              <div className="font-bold">{v.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <div className="w-1/2">
          <div className="mb-4 flex items-center gap-4">
            <div className="text-xl font-bold">Music</div>
            <Button
              size="s"
              color="transparent"
              onClick={() => navigate('idea', { state: [...(tracks ?? []), ...(lyrics ?? [])] })}
            >
              More Music
            </Button>
          </div>
          {/* <div className="flex gap-4">
            <div>This week</div>
            <div>This month</div>
            <div>Last month</div>
          </div> */}
          <div className="flex flex-col gap-4">
            {tracks?.map((v) => (
              <div
                key={v.id}
                className="flex cursor-pointer rounded-lg bg-white p-4"
                onClick={() => navigate(v.id)}
              >
                <Cover url={v.coverFileUrl} size={120} />
                <div className="m-4 flex flex-col justify-center">
                  <div className="font-bold">{v.name}</div>
                  <div className="text-grey">by {v.username}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2">
          <div className="mb-4 flex items-center gap-4">
            <div className="text-xl font-bold">Lyrics</div>
            <Button
              size="s"
              color="transparent"
              onClick={() => navigate('idea', { state: [...(tracks ?? []), ...(lyrics ?? [])] })}
            >
              More Lyrics
            </Button>
          </div>
          {/* <div className="flex gap-4">
            <div>This week</div>
            <div>This month</div>
            <div>Last month</div>
          </div> */}
          <div className="flex flex-col gap-4">
            {lyrics?.map((v) => (
              <div
                key={v.id}
                className="flex cursor-pointer rounded-lg bg-white p-4"
                onClick={() => navigate(v.id)}
              >
                <Cover url={v.coverFileUrl} size={120} />
                <div className="m-4 flex flex-col justify-center">
                  <div className="font-bold">{v.name}</div>
                  <div className="text-grey">by {v.username}</div>
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
