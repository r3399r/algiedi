import classNames from 'classnames';

type Props = { className?: string };

const Divider = ({ className }: Props) => (
  <div className={classNames('h-[1px] bg-black', className)} />
);

export default Divider;
