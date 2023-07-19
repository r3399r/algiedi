import classNames from 'classnames';
import { ChangeEvent, forwardRef, InputHTMLAttributes, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: boolean | string;
  asterisked?: boolean;
  regex?: RegExp;
};

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      hint,
      error,
      asterisked = false,
      className,
      disabled,
      autoComplete = 'off',
      onChange,
      regex,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState<string>();
    const onInput = (v: ChangeEvent<HTMLInputElement>) => {
      if (regex !== undefined && regex.test(v.target.value) === false) return;
      setValue(v.target.value);
      onChange && onChange(v);
    };

    return (
      <div>
        {label && (
          <div className={'text-[14px] text-dark'}>
            {label}
            {asterisked && <span className="text-red">*</span>}
          </div>
        )}
        <input
          className={twMerge(
            `font-[inherit] box-border w-full 
            text-[1em] text-dark bg-transparent border-0 border-solid border-b border-b-dark
            px-0 focus:outline-none focus:border-b-blue
            placeholder:text-grey-500`,
            classNames({
              'border-b-red': !!error,
            }),
            className,
          )}
          disabled={disabled}
          autoComplete={autoComplete}
          ref={ref}
          value={value}
          onChange={onInput}
          {...props}
        />
        {typeof error === 'string' && <div className="text-[12px] text-red mt-[5px]">{error}</div>}
        {hint && <div className="text-[12px] text-dark mt-[5px] whitespace-pre-wrap">{hint}</div>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
