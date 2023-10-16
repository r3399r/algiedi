import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from 'src/component/Footer';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { getExplore } from 'src/service/UploadService';
import Lyrics from './Lyrics';
import Track from './Track';

const Upload = () => {
  const [tab, setTab] = useState<'track' | 'lyrics'>('track');
  const state = useLocation().state as { inspiredId: string } | null;
  const [inspiration, setInspiration] = useState<GetExploreResponse>();

  useEffect(() => {
    getExplore().then((res) => setInspiration(res.data));
  }, []);

  if (!inspiration) return <></>;

  return (
    <>
      <div className="mb-10 text-[20px]">Upload</div>
      <div className="w-full rounded-xl bg-white p-8">
        <div className="mb-6 flex gap-4">
          <div
            className={classNames('cursor-pointer', {
              'border-b-[1px] border-b-purple text-purple': tab === 'track',
            })}
            onClick={() => setTab('track')}
          >
            Track
          </div>
          <div
            className={classNames('cursor-pointer', {
              'border-b-[1px] border-b-purple text-purple': tab === 'lyrics',
            })}
            onClick={() => setTab('lyrics')}
          >
            Lyrics
          </div>
        </div>
        <div>
          {tab === 'track' && (
            <Track defaultInspiredId={state?.inspiredId} inspiration={inspiration} />
          )}
          {tab === 'lyrics' && (
            <Lyrics defaultInspiredId={state?.inspiredId} inspiration={inspiration} />
          )}
        </div>
      </div>
      <div className="mx-auto max-w-[630px] py-16">
        <Footer />
      </div>
    </>
  );
};

export default Upload;
