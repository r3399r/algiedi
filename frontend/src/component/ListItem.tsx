import classNames from 'classnames';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & { focus?: boolean };

const ListItem = ({ children, focus, className, ...props }: Props) => (
  <div
    className={classNames('hover:bg-gray-100 p-[10px]', className, { 'text-[#00c3ff]': focus })}
    {...props}
  >
    {children}
  </div>
);

export default ListItem;
