import classNames from 'classnames';
import { useState } from 'react';
import Footer from 'src/component/Footer';
import Lyrics from './Lyrics';
import Track from './Track';

const Upload = () => {
  const [tab, setTab] = useState<'track' | 'lyrics'>('track');

  return (
    <>
      <div className="text-[20px] mb-10">Upload</div>
      <div className="bg-white rounded-xl w-full p-8">
        <div className="flex gap-4 mb-6">
          <div
            className={classNames('cursor-pointer', {
              'text-[#4346e1] border-b-[1px] border-b-[#4346e1]': tab === 'track',
            })}
            onClick={() => setTab('track')}
          >
            Track
          </div>
          <div
            className={classNames('cursor-pointer', {
              'text-[#4346e1] border-b-[1px] border-b-[#4346e1]': tab === 'lyrics',
            })}
            onClick={() => setTab('lyrics')}
          >
            Lyrics
          </div>
        </div>
        <div>
          {tab === 'track' && <Track />}
          {tab === 'lyrics' && <Lyrics />}
        </div>
      </div>
      <div className="max-w-[630px] mx-auto py-16">
        <Footer />
      </div>
    </>
  );
};

export default Upload;
