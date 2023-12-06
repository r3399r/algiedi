import classNames from 'classnames';
import IcGreyPeople from 'src/image/ic-grey-people.jpg';

type Props = {
  size?: number;
  url: string | null;
  clickable?: boolean;
  onClick?: () => void;
};

const Avatar = ({ size = 100, url, clickable = false, onClick }: Props) => (
  <div
    className={classNames({
      'cursor-pointer': clickable,
    })}
    onClick={() => {
      if (clickable && onClick) onClick();
    }}
  >
    <img
      src={url ?? IcGreyPeople}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  </div>
);

export default Avatar;
