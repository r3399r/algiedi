import classNames from 'classnames';
import { useState } from 'react';
import IcPlus from 'src/image/ic-plus.svg';

type Props = { question: string; answer: string };

const Question = ({ question, answer }: Props) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div className="border-t-2 border-t-black">
      <div className="flex items-center justify-between h-[60px]">
        <div>{question}</div>
        <div className="w-[35px]">
          <img
            src={IcPlus}
            className={classNames('transition-all duration-500 cursor-pointer', {
              'rotate-180': expanded,
            })}
            onClick={() => setExpanded(!expanded)}
          />
        </div>
      </div>
      <div
        className={classNames('transition-all duration-500 overflow-hidden', {
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
