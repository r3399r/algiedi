import classNames from 'classnames';
import { useState } from 'react';
import IcPlus from 'src/image/ic-plus.svg';

type Props = { question: string; answer: string };

const Question = ({ question, answer }: Props) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div className="border-t-2 border-t-black">
      <div className="flex h-[60px] items-center justify-between">
        <div>{question}</div>
        <div className="w-[35px]">
          <img
            src={IcPlus}
            className={classNames('cursor-pointer transition-all duration-500', {
              'rotate-180': expanded,
            })}
            onClick={() => setExpanded(!expanded)}
          />
        </div>
      </div>
      <div
        className={classNames('overflow-hidden transition-all duration-500', {
          'max-h-[100px] pb-4': expanded,
          'max-h-0 pb-0': !expanded,
        })}
      >
        {answer}
      </div>
    </div>
  );
};

export default Question;
