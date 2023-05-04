import classNames from 'classnames';
import { forwardRef, TextareaHTMLAttributes } from 'react';

export type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  helper?: string;
  error?: boolean | string;
  appearance?: 'outline' | 'underline';
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, helper, error, disabled, className, appearance = 'outline', ...props }, ref) => (
    <div>
      {label && (
        <div
          className={classNames('text-[14px] leading-normal text-navy-700 mb-[5px]', {
            'opacity-30': disabled,
          })}
        >
          {label}
        </div>
      )}
      <textarea
        className={classNames('bg-transparent outline-none p-2 w-full', className, {
          'rounded border-solid border-[1px] border-black placeholder:text-black':
            appearance === 'outline',
          'border-solid border-b-[1px] border-[#7ba0ff] placeholder:text-[#7ba0ff]':
            appearance === 'underline',
          'border-red-500': !!error,
        })}
        ref={ref}
        disabled={disabled}
        autoComplete="off"
        {...props}
      />
      {(typeof error === 'string' || helper) && (
        <div className="mt-[5px]">
          {typeof error === 'string' && (
            <div className="text-red-500 text-[12px] leading-normal">{error}</div>
          )}
          {helper && <div className="text-black text-[12px] leading-normal">{helper}</div>}
        </div>
      )}
    </div>
  ),
);

export default Textarea;
