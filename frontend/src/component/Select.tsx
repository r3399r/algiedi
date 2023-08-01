import classNames from 'classnames';
import { isValidElement, ReactNode, useMemo, useRef, useState } from 'react';
import SelectContext from 'src/context/SelectContext';
import IcSelectDisabled from 'src/image/ic-select-disabled.svg';
import IcSelect from 'src/image/ic-select.svg';
import Popover from './Popover';

/**
 * usage example:
 *
 * <Select>
 *   <SelectOption value="aa">a</SelectOption>
 *   <SelectOption value="bb">b</SelectOption>
 *   <SelectOption value="cc">c</SelectOption>
 * </Select>
 */

type Props = {
  children: ReactNode | ReactNode[];
  label?: string;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
};

const Select = ({
  children,
  label,
  disabled,
  onChange,
  defaultValue,
  value: controlledSelectedValue,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(defaultValue ?? '');
  const ref = useRef<HTMLDivElement>(null);

  const options = useMemo(
    () =>
      (Array.isArray(children) ? children : [children]).map((child) =>
        isValidElement(child) ? child.props : null,
      ),
    [],
  );

  const handleChange = (v: string) => {
    setOpen(false);
    if (controlledSelectedValue === undefined) setSelected(v);

    onChange && onChange(v);
  };

  return (
    <SelectContext.Provider value={{ current: controlledSelectedValue ?? selected, handleChange }}>
      <div className="min-w-[160px] border-b-[1px] border-b-black">
        {label && (
          <div
            className={classNames('text-navy-700 mb-[5px] text-[14px] leading-normal', {
              'opacity-30': disabled,
            })}
          >
            {label}
          </div>
        )}
        <div
          className={classNames(
            'bg-grey-200 flex h-[40px] justify-between rounded p-2 outline-none',
            {
              'cursor-pointer': !disabled,
              'cursor-not-allowed': !!disabled,
            },
          )}
          onClick={() => !disabled && setOpen(true)}
          ref={ref}
        >
          <div
            className={classNames({
              'text-grey-500': !!disabled,
              'text-navy-900': !disabled,
            })}
          >
            {options.find((v) => v.value === (controlledSelectedValue ?? selected))?.children}
          </div>
          <div>{disabled ? <img src={IcSelectDisabled} /> : <img src={IcSelect} />}</div>
        </div>
        <Popover
          open={open}
          onClose={() => setOpen(false)}
          anchorEl={ref.current}
          cssProperties={{ width: ref.current?.offsetWidth }}
        >
          <>{children}</>
        </Popover>
      </div>
    </SelectContext.Provider>
  );
};

export default Select;
