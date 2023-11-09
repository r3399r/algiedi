import { useMemo, useRef, useState } from 'react';
import Tabs from 'src/component/Tabs';
import ExhibitFollow from './ExhibitFollow';
import ExhibitInspiration from './ExhibitInspiration';
import ExhibitLikes from './ExhibitLikes';
import ExhibitOriginal from './ExhibitOriginal';
import ExhibitPublish from './ExhibitPublish';

const Exhibits = () => {
  const [tab, setTab] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  const countPerPage = useMemo(
    () => (ref.current ? ((ref.current.offsetWidth / 162) * 2).toFixed() : '10'),
    [ref.current],
  );

  return (
    <>
      <div className="mb-4">
        <Tabs
          labels={['Published', 'Original', 'Inspiration', 'Likes', 'Following']}
          onChange={(i) => setTab(i)}
          defaultIndex={0}
        />
      </div>
      <div ref={ref}>
        {tab === 0 && <ExhibitPublish countPerPage={countPerPage} />}
        {tab === 1 && <ExhibitOriginal countPerPage={countPerPage} />}
        {tab === 2 && <ExhibitInspiration countPerPage={countPerPage} />}
        {tab === 3 && <ExhibitLikes countPerPage={countPerPage} />}
        {tab === 4 && <ExhibitFollow countPerPage={countPerPage} />}
      </div>
    </>
  );
};

export default Exhibits;
