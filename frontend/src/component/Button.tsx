import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  appearance?: 'primary' | 'secondary' | 'border';
};

const Button = ({ appearance = 'primary', className, ...props }: Props) => (
  <button
    className={classNames('rounded-[37px] px-10 py-4 text-[14px] outline-none', className, {
      'bg-[#00c3ff] text-white hover:bg-[#0090ff] disabled:bg-blue-100 disabled:text-opacity-40':
        appearance === 'primary',
      'bg-[#4346E1] text-white disabled:bg-purple-100 disabled:text-opacity-30':
        appearance === 'secondary',
      'border-[1px] border-solid border-black text-black bg-transparent hover:bg-[#00c3ff] hover:border-[#00c3ff] hover:text-white disabled:bg-white disabled:border-black disabled:text-black disabled:opacity-30':
        appearance === 'border',
    })}
    type="button"
    {...props}
  />
);

export default Button;
