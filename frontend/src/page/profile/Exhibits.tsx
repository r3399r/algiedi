import { useState } from 'react';
import Tabs from 'src/component/Tabs';
import ExhibitOriginal from './ExhibitOriginal';
import ExhibitPublish from './ExhibitPublish';

const Exhibits = () => {
  const [tab, setTab] = useState<number>(0);
  // const [published, setPublished] = useState<GetExploreResponse>([]);
  // const [original, setOriginal] = useState<GetExploreResponse>([]);
  // const [inspiration, setInspiration] = useState<GetExploreResponse>([]);
  // const [likes, setLikes] = useState<GetMeSocialResponse['creation']>([]);
  // const [followee, setFollowee] = useState<GetMeSocialResponse['followee']>([]);

  // useEffect(() => {
  //   getExplores().then((res) => {
  //     setPublished(res.published);
  //     setOriginal(res.original);
  //     setInspiration(res.inspiration);
  //   });
  //   getSocials().then((res) => {
  //     setLikes(res.creation);
  //     setFollowee(res.followee);
  //   });
  // }, []);

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
      {tab === 2 && <ExhibitOriginal />}
      {tab === 3 && (
        <div className="flex flex-wrap gap-6">
          {/* {likes.length > 0
            ? likes.map((v) => (
                <div
                  key={v.id}
                  className="cursor-pointer text-center"
                  onClick={() => navigate(`${Page.Explore}/${v.id}`)}
                >
                  <Cover url={v.coverFileUrl} size={150} />
                  <div className="font-bold">{v.name}</div>
                </div>
              ))
            : 'There is no inspiration creation.'} */}
        </div>
      )}
      {tab === 4 && (
        <div className="flex flex-wrap gap-6">
          {/* {followee.length > 0
            ? followee.map((v) => (
                <div key={v.id} className="text-center">
                  <Avatar url={v.avatarUrl} size={150} />
                  <div className="font-bold">{v.username}</div>
                </div>
              ))
            : 'There is no inspiration creation.'} */}
        </div>
      )}
    </>
  );
};

export default Exhibits;
