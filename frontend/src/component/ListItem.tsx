import classNames from 'classnames';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & { focus?: boolean };

const ListItem = ({ children, focus, className, ...props }: Props) => (
  <div
    className={classNames(
      'cursor-pointer p-[10px] hover:bg-grey/30',
      { 'text-blue': focus },
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export default ListItem;
