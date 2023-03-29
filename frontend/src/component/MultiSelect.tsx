import classNames from 'classnames';
import { ReactNode, useRef, useState } from 'react';
import SelectContext from 'src/context/SelectContext';
import IcSelectDisabled from 'src/image/ic-select-disabled.svg';
import IcSelect from 'src/image/ic-select.svg';
import Popover from './Popover';

/**
 * usage example:
 *
 * <MultiSelect>
 *   <MultiSelectOption value="aa">a</MultiSelectOption>
 *   <MultiSelectOption value="bb">b</MultiSelectOption>
 *   <MultiSelectOption value="cc">c</MultiSelectOption>
 * </MultiSelect>
 */

type Props = {
  children: ReactNode | ReactNode[];
  label?: string;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (v: string) => void;
};

const MultiSelect = ({ children, label, disabled, onChange }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  const handleChange = (v: string) => {
    const tmp = new Set(selected);

    if (tmp.has(v)) tmp.delete(v);
    else tmp.add(v);

    setSelected(tmp);
    onChange && onChange([...tmp].join());
  };

  return (
    <SelectContext.Provider value={{ current: [...selected].join(), handleChange }}>
      <div className="min-w-[160px] border-b-[1px] border-b-black">
        {label && (
          <div
            className={classNames('text-[14px] leading-normal text-navy-700 mb-[5px]', {
              'opacity-30': disabled,
            })}
          >
            {label}
          </div>
        )}
        <div
          className={classNames(
            'rounded bg-grey-200 outline-none p-2 h-[40px] flex justify-between',
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
            {[...selected].join()}
          </div>
          <div>{disabled ? <img src={IcSelectDisabled} /> : <img src={IcSelect} />}</div>
        </div>
        <Popover
          open={open}
          onClose={() => setOpen(false)}
          anchorEl={ref.current}
          // cssProperties={{ width: ref.current?.offsetWidth }}
        >
          <>{children}</>
        </Popover>
      </div>
    </SelectContext.Provider>
  );
};

export default MultiSelect;
