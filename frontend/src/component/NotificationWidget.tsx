import classNames from 'classnames';

type Props = {
  className?: string;
};

const NotificationWidget = ({ className }: Props) => (
  <div
    className={classNames(
      'flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-xl bg-red font-bold text-white shadow-lg',
      className,
    )}
  >
    5
  </div>
);

export default NotificationWidget;
