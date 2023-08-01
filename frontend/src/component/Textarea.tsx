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
          className={classNames('text-navy-700 mb-[5px] text-[14px] leading-normal', {
            'opacity-30': disabled,
          })}
        >
          {label}
        </div>
      )}
      <textarea
        className={classNames('w-full bg-transparent p-2 outline-none', className, {
          'rounded border-[1px] border-solid border-black placeholder:text-black':
            appearance === 'outline',
          'border-b-[1px] border-solid border-[#7ba0ff] placeholder:text-[#7ba0ff]':
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
            <div className="text-[12px] leading-normal text-red">{error}</div>
          )}
          {helper && <div className="text-[12px] leading-normal text-black">{helper}</div>}
        </div>
      )}
    </div>
  ),
);

export default Textarea;
