import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  appearance?: 'primary' | 'secondary' | 'border';
};

const Button = ({ appearance = 'primary', className, ...props }: Props) => (
  <button
    className={classNames('rounded-[37px] px-10 py-4 text-[14px] outline-none', className, {
      'bg-[#00c3ff] text-white active:bg-blue-500 disabled:bg-blue-100 disabled:text-opacity-40':
        appearance === 'primary',
      'bg-purple-500 text-white active:bg-purple-300 disabled:bg-purple-100 disabled:text-opacity-30':
        appearance === 'secondary',
      'border-[1px] border-solid border-black text-black bg-transparent hover:bg-blue-300 hover:border-blue-300 hover:text-white disabled:bg-white disabled:border-black disabled:text-black disabled:opacity-30':
        appearance === 'border',
    })}
    {...props}
  />
);

export default Button;
