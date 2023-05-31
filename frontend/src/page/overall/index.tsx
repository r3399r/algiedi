import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { DetailedProject } from 'src/model/backend/Project';
import { getMyProjects } from 'src/service/OverallService';

const Overall = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DetailedProject[]>();

  useEffect(() => {
    getMyProjects().then((res) => setProjects(res));
  }, []);

  return (
    <>
      <div className="text-[20px]">Overview</div>
      <div className="text-gray-400">{projects?.length} pieces</div>
      <div className="text-[20px] mt-10">Open</div>
      <div className="text-gray-400">{projects?.length} creations</div>
      {projects?.map((v) => {
        const main = v.originalTrack || v.originalLyrics;
        const coverFileUrl = main?.coverFileUrl;

        return (
          <div
            key={v.id}
            className="relative mt-1 rounded p-4 bg-gray-400 cursor-pointer bg-center"
            style={{ backgroundImage: coverFileUrl ? `url(${coverFileUrl})` : '' }}
            onClick={() => navigate(Page.Project, { state: { id: v.id } })}
          >
            <div className="p-2 bg-gray-50 w-fit rounded-lg bg-opacity-70">{main?.name}</div>
          </div>
        );
      })}
      <div className="text-[20px] mt-10">Porjects in Progress</div>
      <div className="text-gray-400">0 projects</div>
    </>
  );
};

export default Overall;
