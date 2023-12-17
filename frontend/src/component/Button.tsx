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
      classNames('rounded-[36px] leading-[1.5] outline-none', {
        'bg-blue/70 text-white hover:bg-blue/80 active:bg-blue disabled:bg-blue/30':
          color === 'blue',
        'bg-purple/70 text-white hover:bg-purple/80 active:bg-purple disabled:bg-purple/30':
          color === 'purple',
        'border border-solid border-dark bg-transparent hover:border-transparent hover:bg-blue hover:text-white active:bg-black/30':
          color === 'transparent',
        'px-5 py-[10px] text-[20px]': size === 'l',
        'px-4 py-2 text-[16px]': size === 'm',
        'px-3 py-1 text-[14px]': size === 's',
      }),
      className,
    )}
    type="button"
    {...props}
  />
);

export default Button;
