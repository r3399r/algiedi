import { useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from 'src/component/Tabs';
import { RootState } from 'src/redux/store';
import { setProfileExhibitTab } from 'src/redux/uiSlice';
import ExhibitFollow from './ExhibitFollow';
import ExhibitInspiration from './ExhibitInspiration';
import ExhibitLikes from './ExhibitLikes';
import ExhibitOriginal from './ExhibitOriginal';
import ExhibitPublish from './ExhibitPublish';

const Exhibits = () => {
  const dispatch = useDispatch();
  const { profileExhibitTab } = useSelector((rootState: RootState) => rootState.ui);
  const ref = useRef<HTMLDivElement>(null);
  const countPerPage = useMemo(
    () => (ref.current ? (Math.floor((ref.current.offsetWidth + 24) / 174) * 2).toString() : '10'),
    [ref.current],
  );

  return (
    <>
      <div className="mb-4">
        <Tabs
          labels={['Published', 'Original', 'Inspiration', 'Likes', 'Following']}
          onChange={(i) => dispatch(setProfileExhibitTab(i))}
          defaultIndex={profileExhibitTab}
        />
      </div>
      <div ref={ref}>
        {profileExhibitTab === 0 && <ExhibitPublish countPerPage={countPerPage} />}
        {profileExhibitTab === 1 && <ExhibitOriginal countPerPage={countPerPage} />}
        {profileExhibitTab === 2 && <ExhibitInspiration countPerPage={countPerPage} />}
        {profileExhibitTab === 3 && <ExhibitLikes countPerPage={countPerPage} />}
        {profileExhibitTab === 4 && <ExhibitFollow countPerPage={countPerPage} />}
      </div>
    </>
  );
};

export default Exhibits;
