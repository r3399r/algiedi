import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'blue' | 'purple' | 'transparent';
  size?: 's' | 'm' | 'l';
};

const Button = ({ color = 'blue', size = 'l', className, ...props }: Props) => (
  <button
    className={twMerge(
      classNames('rounded-[36px] outline-none leading-[1.5]', {
        'bg-blue/70 hover:bg-blue/80 active:bg-blue text-white': color === 'blue',
        'bg-purple/70 hover:bg-purple/80 active:bg-purple text-white': color === 'purple',
        'border border-solid border-dark bg-transparent hover:bg-grey active:bg-black/30':
          color === 'transparent',
        'text-[20px] px-5 py-[10px]': size === 'l',
        'text-[16px] px-4 py-2': size === 'm',
        'text-[14px] px-3 py-1': size === 's',
      }),
      className,
    )}
    type="button"
    {...props}
  />
);

export default Button;
