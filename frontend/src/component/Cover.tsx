import classNames from 'classnames';

type Props = {
  size?: number;
  url: string | null;
  clickable?: boolean;
  onClick?: () => void;
};

const Cover = ({ size = 100, url, clickable = false, onClick }: Props) => (
  <div
    className={classNames({
      'cursor-pointer': clickable,
    })}
    onClick={() => {
      if (clickable && onClick) onClick();
    }}
  >
    {url ? (
      <img src={url} className="rounded-full object-cover" style={{ width: size, height: size }} />
    ) : (
      <div className="rounded-full bg-grey" style={{ width: size, height: size }} />
    )}
  </div>
);

export default Cover;
