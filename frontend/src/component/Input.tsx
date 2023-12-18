import classNames from 'classnames';
import { ChangeEvent, forwardRef, InputHTMLAttributes, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Tooltip from './Tooltip';

export type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: boolean | string;
  asterisked?: boolean;
  regex?: RegExp;
  tooltip?: string;
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
      tooltip,
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
          <div className="flex items-center text-[14px] text-dark">
            {label}
            {asterisked && <span className="text-red">*</span>}
            {tooltip && (
              <div>
                <Tooltip title={tooltip} />
              </div>
            )}
          </div>
        )}
        <input
          className={twMerge(
            `placeholder:text-grey-500 box-border w-full 
            border-0 border-b border-solid border-b-dark bg-transparent px-0 font-[inherit]
            text-[1em] text-dark focus:border-b-blue
            focus:outline-none`,
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
        {typeof error === 'string' && <div className="mt-[5px] text-[12px] text-red">{error}</div>}
        {hint && <div className="mt-[5px] whitespace-pre-wrap text-[12px] text-dark">{hint}</div>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
