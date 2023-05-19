import { useEffect, useState } from 'react';
import { CombinedProject } from 'src/model/backend/Project';
import { getMyProjects } from 'src/service/OverallService';

const Overall = () => {
  const [projects, setProjects] = useState<CombinedProject[]>();

  useEffect(() => {
    getMyProjects().then((res) => setProjects(res));
  }, []);

  return (
    <>
      <div className="text-[20px]">Overview</div>
      <div className="text-gray-400">{projects?.length} pieces</div>
      <div className="text-[20px] mt-10">Open</div>
      <div className="text-gray-400">{projects?.length} creations</div>
      {projects?.map((v) => (
        <div
          key={v.id}
          className="relative mt-1 rounded p-4 bg-gray-400 cursor-pointer"
          style={{ backgroundImage: v.coverFileUrl ? `url(${v.coverFileUrl})` : '' }}
        >
          <div className="p-1 bg-gray-50 w-fit rounded-lg bg-opacity-70">{v.name}</div>
        </div>
      ))}
      <div className="text-[20px] mt-10">Porjects in Progress</div>
      <div className="text-gray-400">0 projects</div>
    </>
  );
};

export default Overall;
