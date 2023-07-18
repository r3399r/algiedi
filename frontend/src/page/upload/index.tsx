import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from 'src/component/Footer';
import { DetailedCreation } from 'src/model/backend/Project';
import { getExplore } from 'src/service/UploadService';
import Lyrics from './Lyrics';
import Track from './Track';

const Upload = () => {
  const [tab, setTab] = useState<'track' | 'lyrics'>('track');
  const state = useLocation().state as { inspiredId: string } | null;
  const [inspiration, setInspiration] = useState<DetailedCreation[]>();

  useEffect(() => {
    getExplore().then((res) => setInspiration(res));
  }, []);

  if (!inspiration) return <></>;

  return (
    <>
      <div className="text-[20px] mb-10">Upload</div>
      <div className="bg-white rounded-xl w-full p-8">
        <div className="flex gap-4 mb-6">
          <div
            className={classNames('cursor-pointer', {
              'text-purple border-b-[1px] border-b-purple': tab === 'track',
            })}
            onClick={() => setTab('track')}
          >
            Track
          </div>
          <div
            className={classNames('cursor-pointer', {
              'text-purple border-b-[1px] border-b-purple': tab === 'lyrics',
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
      <div className="max-w-[630px] mx-auto py-16">
        <Footer />
      </div>
    </>
  );
};

export default Upload;
