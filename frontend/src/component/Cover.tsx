import classNames from 'classnames';
import IcGreyPeople from 'src/image/ic-grey-people.jpg';

type Props = {
  size?: number;
  url: string | null;
  clickable?: boolean;
  onClick?: () => void;
  type?: 'user' | 'creation';
};

const Cover = ({ size = 100, url, clickable = false, onClick, type = 'creation' }: Props) => (
  <div
    className={classNames({
      'cursor-pointer': clickable,
    })}
    onClick={() => {
      if (clickable && onClick) onClick();
    }}
  >
    {url || type === 'user' ? (
      <img
        src={url ?? IcGreyPeople}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    ) : (
      <div className="rounded-full bg-grey" style={{ width: size, height: size }} />
    )}
  </div>
);

export default Cover;
