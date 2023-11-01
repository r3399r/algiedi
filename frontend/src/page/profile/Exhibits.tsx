import { useState } from 'react';
import Tabs from 'src/component/Tabs';
import ExhibitFollow from './ExhibitFollow';
import ExhibitInspiration from './ExhibitInspiration';
import ExhibitLikes from './ExhibitLikes';
import ExhibitOriginal from './ExhibitOriginal';
import ExhibitPublish from './ExhibitPublish';

const Exhibits = () => {
  const [tab, setTab] = useState<number>(0);

  return (
    <>
      <div className="mb-4">
        <Tabs
          labels={['Published', 'Original', 'Inspiration', 'Likes', 'Following']}
          onChange={(i) => setTab(i)}
          defaultIndex={0}
        />
      </div>
      {tab === 0 && <ExhibitPublish />}
      {tab === 1 && <ExhibitOriginal />}
      {tab === 2 && <ExhibitInspiration />}
      {tab === 3 && <ExhibitLikes />}
      {tab === 4 && <ExhibitFollow />}
    </>
  );
};

export default Exhibits;
