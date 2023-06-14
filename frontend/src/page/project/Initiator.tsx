import IcProfile from 'src/image/ic-profile.svg';
import { DetailedCreation } from 'src/model/backend/Project';

type Props = {
  creation: DetailedCreation;
};

const Initiator = ({ creation }: Props) => (
  <>
    <div className="font-bold">Initiator</div>
    <div className="w-fit text-center px-4 py-2">
      <img src={IcProfile} />
      <div>{creation.username}</div>
    </div>
  </>
);

export default Initiator;
