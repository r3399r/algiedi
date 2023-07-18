import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { Status } from 'src/model/backend/constant/Project';
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
      <div className="text-grey">{projects?.length} pieces</div>
      <div className="text-[20px] mt-10">Open</div>
      <div className="text-grey">
        {projects?.filter((v) => v.status === Status.Created).length} creations
      </div>
      {projects
        ?.filter((v) => v.status === Status.Created)
        .map((v) => (
          <div
            key={v.id}
            className="relative mt-1 rounded-md p-4 bg-blue/70 cursor-pointer bg-center"
            style={{ backgroundImage: v.coverFileUrl ? `url(${v.coverFileUrl})` : '' }}
            onClick={() => navigate(Page.Project, { state: { id: v.id } })}
          >
            <div className="p-2 bg-grey/70 w-fit rounded-lg">{v?.name}</div>
          </div>
        ))}
      <div className="text-[20px] mt-10">Porjects in Progress</div>
      <div className="text-grey">
        {projects?.filter((v) => v.status === Status.InProgress).length} projects
      </div>
      {projects
        ?.filter((v) => v.status === Status.InProgress)
        .map((v) => (
          <div
            key={v.id}
            className="relative mt-1 rounded-md p-4 bg-blue/70 cursor-pointer bg-center"
            style={{ backgroundImage: v.coverFileUrl ? `url(${v.coverFileUrl})` : '' }}
            onClick={() => navigate(Page.Project, { state: { id: v.id } })}
          >
            <div className="p-2 bg-grey/70 w-fit rounded-lg">{v?.name}</div>
          </div>
        ))}
    </>
  );
};

export default Overall;
