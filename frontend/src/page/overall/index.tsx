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
      <div className="mt-10 text-[20px]">Open</div>
      <div className="text-grey">
        {projects?.filter((v) => v.project?.status === Status.Created).length} creations
      </div>
      {projects
        ?.filter((v) => v.project?.status === Status.Created)
        .map((v) => (
          <div
            key={v.id}
            className="relative mt-1 cursor-pointer rounded-md bg-blue/70 bg-center p-4"
            style={{ backgroundImage: v.info.coverFileUrl ? `url(${v.info.coverFileUrl})` : '' }}
            onClick={() => navigate(Page.Project, { state: { id: v.id } })}
          >
            <div className="w-fit rounded-lg bg-grey/70 p-2">{v?.info.name}</div>
          </div>
        ))}
      <div className="mt-10 text-[20px]">Projects in Progress</div>
      <div className="text-grey">
        {projects?.filter((v) => v.project?.status === Status.InProgress).length} projects
      </div>
      {projects
        ?.filter((v) => v.project?.status === Status.InProgress)
        .map((v) => (
          <div
            key={v.id}
            className="relative mt-1 cursor-pointer rounded-md bg-blue/70 bg-center p-4"
            style={{ backgroundImage: v.info.coverFileUrl ? `url(${v.info.coverFileUrl})` : '' }}
            onClick={() => navigate(Page.Project, { state: { id: v.id } })}
          >
            <div className="w-fit rounded-lg bg-grey/70 p-2">{v.info.name}</div>
          </div>
        ))}
    </>
  );
};

export default Overall;
