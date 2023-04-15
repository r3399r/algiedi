import classNames from 'classnames';
import { ChangeEvent, forwardRef, InputHTMLAttributes, useState } from 'react';

export type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
  error?: boolean | string;
  regex?: RegExp;
  startsWith?: string;
  appearance?: 'outline' | 'underline';
};

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      helper,
      error,
      disabled,
      onChange,
      regex,
      defaultValue,
      className,
      startsWith,
      appearance = 'outline',
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState<string>((defaultValue as string) ?? '');
    const onInput = (v: ChangeEvent<HTMLInputElement>) => {
      const input = startsWith ? v.target.value.substring(startsWith.length) : v.target.value;
      if (regex !== undefined && regex.test(input) === false) return;
      setValue(input);
      onChange && onChange({ ...v, target: { ...v.target, value: input } });
    };

    return (
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
        <input
          className={classNames('bg-transparent outline-none p-2 h-[40px] w-full', className, {
            'rounded border-solid border-[1px] border-black placeholder:text-black':
              appearance === 'outline',
            'border-solid border-b-[1px] border-[#7ba0ff] placeholder:text-[#7ba0ff]':
              appearance === 'underline',
            'border-red-500': !!error,
          })}
          ref={ref}
          disabled={disabled}
          autoComplete="off"
          value={`${startsWith ?? ''}${value}`}
          onChange={onInput}
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
    );
  },
);

export default Input;
