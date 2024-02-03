import { useMemo } from 'react';
import { DetailedProject } from 'src/model/backend/Project';
import { bn } from 'src/util/bignumber';

type Props = {
  project: DetailedProject;
};

const Progress = ({ project }: Props) => {
  const numerator = useMemo(() => project.collaborators.filter((v) => v.isReady).length, [project]);
  const denominator = useMemo(() => project.collaborators.length, [project]);
  const fraction = useMemo(
    () => bn(numerator).div(denominator).times(100).toFixed(0),
    [numerator, denominator],
  );

  return (
    <div className="my-2 flex w-[250px] items-center justify-between gap-2">
      <div className="relative h-1 w-5/6 bg-grey">
        <div className="absolute h-1 bg-purple" style={{ width: `${fraction}%` }} />
      </div>
      <div className="w-1/6 text-center">{fraction}%</div>
    </div>
  );
};

export default Progress;
