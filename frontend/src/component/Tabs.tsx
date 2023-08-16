import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * usage example:
 *
 * <Tabs
 *   labels={['item1', 'item2']}
 *   onChange={(i) => console.log(i)}
 *   defaultIndex={1}
 * />
 */

type Props = {
  labels: string[];
  onChange?: (i: number) => void;
  defaultIndex?: number;
};

const Tabs = ({ labels, onChange, defaultIndex = 0 }: Props) => {
  const [current, setCurrent] = useState<number>(defaultIndex);
  const ref = useRef<HTMLDivElement>(null);
  const [tabWidth, setTabWidth] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    setTabWidth(ref.current?.children[current].getBoundingClientRect().width ?? 0);

    const parentLeft = ref.current?.getBoundingClientRect().left ?? 0;
    const childLeft = ref.current?.children[current].getBoundingClientRect().left ?? 0;
    setOffset(childLeft - parentLeft);
  }, [ref, current]);

  const onClick = (i: number) => () => {
    setCurrent(i);
    onChange && onChange(i);
  };

  return (
    <div className="relative flex h-[40px] w-fit gap-[20px]" ref={ref}>
      {labels.map((label, i) => (
        <div
          key={i}
          onClick={onClick(i)}
          className={twMerge(
            'box-border min-w-[40px] cursor-pointer px-[5px] py-[9px] text-center font-bold text-grey',
            classNames({
              'text-purple': i === current,
            }),
          )}
        >
          {label}
        </div>
      ))}
      <div
        className="absolute top-[40px] mt-[-2px] h-[2px] bg-purple transition-[left_width] duration-200"
        style={{ width: tabWidth, left: offset }}
      />
    </div>
  );
};

export default Tabs;
