import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Cover from 'src/component/Cover';
import CoverInfo from 'src/component/CoverInfo';
import ExploreSearch from 'src/component/ExploreSearch';
import NotificationWidget from 'src/component/NotificationWidget';
import Tabs from 'src/component/Tabs';
import { Page } from 'src/constant/Page';
import { GetExploreFeaturedResponse } from 'src/model/backend/api/Explore';
import { RootState } from 'src/redux/store';
import { getExploreFeatured } from 'src/service/ExploreService';

const Explore = () => {
  const navigate = useNavigate();
  const { isLogin } = useSelector((rootState: RootState) => rootState.ui);
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
      <div className="flex items-end justify-between">
        <ExploreSearch />
        {isLogin && <NotificationWidget />}
      </div>
      <div className="my-4 flex items-center gap-4">
        <div className="text-xl font-bold">FEATURED SONGS</div>
        <Button size="s" color="transparent" onClick={() => navigate('song')}>
          More Songs...
        </Button>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="mb-6 flex gap-4">
          {songs?.map((v) => (
            <div className="w-[150px] shrink-0" key={v.id}>
              <CoverInfo
                size={150}
                navigateTo={v.id}
                coverFileUrl={v.info.coverFileUrl}
                name={v.info.name}
                author={v.user}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <div className="w-1/2">
          <div className="mb-4 flex items-center gap-4">
            <div className="text-xl font-bold">Tracks</div>
            <Button size="s" color="transparent" onClick={() => navigate('idea?tab=track')}>
              More Tracks...
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
                  <div
                    className="text-grey hover:underline"
                    onClick={(e: MouseEvent<HTMLDivElement>) => {
                      e.stopPropagation();
                      navigate(`${Page.Explore}/user/${v.user.id}`);
                    }}
                  >
                    {v.user.username}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2">
          <div className="mb-4 flex items-center gap-4">
            <div className="text-xl font-bold">Lyrics</div>
            <Button size="s" color="transparent" onClick={() => navigate('idea?tab=lyrics')}>
              More Lyrics...
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
                  <div
                    className="text-grey hover:underline"
                    onClick={(e: MouseEvent<HTMLDivElement>) => {
                      e.stopPropagation();
                      navigate(`${Page.Explore}/user/${v.user.id}`);
                    }}
                  >
                    {v.user.username}
                  </div>
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
