import IcProfile from 'src/image/ic-profile.svg';
import { DetailedCreation } from 'src/model/backend/Project';

type Props = {
  creations: DetailedCreation[];
};

const Partners = ({ creations }: Props) => (
  <>
    <div className="font-bold">Partners</div>
    <div className="flex">
      {creations.map((v) => (
        <div key={v.id} className="w-fit text-center px-4 py-2">
          <img src={IcProfile} />
          <div>{v.username}</div>
        </div>
      ))}
    </div>
  </>
);

export default Partners;
