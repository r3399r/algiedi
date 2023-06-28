import { useMemo } from 'react';
import IcProfile from 'src/image/ic-profile.svg';
import { DetailedCreation } from 'src/model/backend/Project';

type Props = {
  creations: DetailedCreation[];
};

const Partners = ({ creations }: Props) => {
  const user = useMemo(() => {
    const res: DetailedCreation[] = [];
    const uniqUser = new Set(creations.map((v) => v.username));
    uniqUser.forEach((v) => {
      const tmp = creations.find((u) => u.username === v);
      if (tmp) res.push(tmp);
    });

    return res;
  }, [creations]);

  return (
    <>
      <div className="font-bold">Partners</div>
      <div className="flex">
        {user.map((v) => (
          <div key={v.id} className="w-fit text-center px-4 py-2">
            <img src={IcProfile} />
            <div>{v.username}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Partners;
