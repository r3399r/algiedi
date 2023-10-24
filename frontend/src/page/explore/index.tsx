import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Cover from 'src/component/Cover';
import ExploreSearch from 'src/component/ExploreSearch';
import Tabs from 'src/component/Tabs';
import { GetExploreFeaturedResponse } from 'src/model/backend/api/Explore';
import { getExploreFeatured } from 'src/service/ExploreService';

const Explore = () => {
  const navigate = useNavigate();
  const [tabMusic, setTabMusic] = useState<number>(0);
  const [tabLyrics, setTabLyrics] = useState<number>(0);
  const [tracks, setTracks] = useState<GetExploreFeaturedResponse['track']>();
  const [lyrics, setLyrics] = useState<GetExploreFeaturedResponse['lyrics']>();
  const [songs, setSongs] = useState<GetExploreFeaturedResponse['song']>();

  const tabDataMusic = useMemo(() => {
    if (!tracks) return;
    if (tabMusic === 0) return tracks.thisWeek;
    if (tabMusic === 1) return tracks.thisMonth;

    return tracks.lastMonth; // tabMusic = 2
  }, [tabMusic, tracks]);

  const tabDataLyrics = useMemo(() => {
    if (!lyrics) return;
    if (tabLyrics === 0) return lyrics.thisWeek;
    if (tabLyrics === 1) return lyrics.thisMonth;

    return lyrics.lastMonth; // tabLyrics = 2
  }, [tabLyrics, lyrics]);

  useEffect(() => {
    getExploreFeatured().then((res) => {
      setTracks(res.track);
      setLyrics(res.lyrics);
      setSongs(res.song);
    });
  }, []);

  return (
    <div className="bg-[#fafafa] px-4">
      <ExploreSearch />
      <div className="my-4 flex items-center gap-4">
        <div className="text-xl font-bold">FEATURED SONGS</div>
        <Button size="s" color="transparent" onClick={() => navigate('song')}>
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
              <Cover url={v.info.coverFileUrl} size={150} />
              <div className="font-bold">{v.info.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <div className="w-1/2">
          <div className="mb-4 flex items-center gap-4">
            <div className="text-xl font-bold">Music</div>
            <Button size="s" color="transparent" onClick={() => navigate('idea?tab=track')}>
              More Music
            </Button>
          </div>
          <Tabs
            labels={['This week', 'This month', 'Last month']}
            onChange={(i) => setTabMusic(i)}
            defaultIndex={0}
          />
          <div className="flex flex-col gap-4">
            {tabDataMusic?.map((v) => (
              <div
                key={v.id}
                className="flex cursor-pointer rounded-lg bg-white p-4"
                onClick={() => navigate(v.id)}
              >
                <Cover url={v.info.coverFileUrl} size={120} />
                <div className="m-4 flex flex-col justify-center">
                  <div className="font-bold">{v.info.name}</div>
                  <div className="text-grey">by {v.user.username}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2">
          <div className="mb-4 flex items-center gap-4">
            <div className="text-xl font-bold">Lyrics</div>
            <Button size="s" color="transparent" onClick={() => navigate('idea?tab=lyrics')}>
              More Lyrics
            </Button>
          </div>
          <Tabs
            labels={['This week', 'This month', 'Last month']}
            onChange={(i) => setTabLyrics(i)}
            defaultIndex={0}
          />
          <div className="flex flex-col gap-4">
            {tabDataLyrics?.map((v) => (
              <div
                key={v.id}
                className="flex cursor-pointer rounded-lg bg-white p-4"
                onClick={() => navigate(v.id)}
              >
                <Cover url={v.info.coverFileUrl} size={120} />
                <div className="m-4 flex flex-col justify-center">
                  <div className="font-bold">{v.info.name}</div>
                  <div className="text-grey">by {v.user.username}</div>
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
