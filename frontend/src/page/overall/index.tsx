import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from 'src/component/AudioPlayer';
import NotificationWidget from 'src/component/NotificationWidget';
import { Page } from 'src/constant/Page';
import { Role, Status } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { getMyProjects } from 'src/service/OverallService';

const Overall = () => {
  const navigate = useNavigate();
  const { id: userId } = useSelector((rootState: RootState) => rootState.me);
  const [projects, setProjects] = useState<DetailedProject[]>();
  const numOriginals = useMemo(
    () =>
      projects?.filter(
        (v) =>
          v.project?.status === Status.Created &&
          v.collaborators.find((o) => o.user.id === userId && o.role === Role.Owner),
      ).length,
    [projects, userId],
  );
  const numInspirations = useMemo(
    () =>
      projects?.filter(
        (v) =>
          v.project?.status === Status.Created &&
          v.collaborators.find((o) => o.user.id === userId && o.role !== Role.Owner),
      ).length,
    [projects, userId],
  );
  const numInProgress = useMemo(
    () => projects?.filter((v) => v.project?.status === Status.InProgress).length,
    [projects],
  );

  useEffect(() => {
    getMyProjects().then((res) => setProjects(res));
  }, []);

  return (
    <>
      <div className="flex items-end justify-between">
        <div className="text-[20px] font-bold">Overview</div>
        <NotificationWidget />
      </div>
      <div className="text-grey">{projects?.length} pieces</div>
      <div className="mt-10 text-[20px] font-bold">Open</div>
      <div className="mb-2 text-grey">
        {numOriginals} originals & {numInspirations} inspirations
      </div>
      <div className="flex flex-wrap gap-4">
        {projects
          ?.filter((v) => v.project?.status === Status.Created)
          .map((v) => {
            const collaborator = v.collaborators.find((o) => o.user.id === userId);

            return (
              <div
                key={v.id}
                className="relative box-border w-[calc(50%-8px)] cursor-pointer rounded-md bg-blue/70 bg-center p-4 shadow-md"
                style={{
                  backgroundImage: v.info.coverFileUrl ? `url(${v.info.coverFileUrl})` : '',
                }}
                onClick={() => navigate(Page.Project, { state: { id: v.id } })}
              >
                <div className="w-fit rounded-lg bg-grey/70 p-2">{v?.info.name}</div>
                {collaborator?.track && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <AudioPlayer
                      creation={{
                        id: v.id,
                        info: v.info,
                        fileUrl: collaborator.track.fileUrl,
                        username:
                          v.collaborators.find((o) => o.user.id === userId)?.user.username ?? '',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div className="mt-10 text-[20px] font-bold">Projects in Progress</div>
      <div className="mb-2 text-grey">{numInProgress} projects</div>
      <div className="flex flex-col gap-4">
        {projects
          ?.filter((v) => v.project?.status === Status.InProgress)
          .map((v) => (
            <div
              key={v.id}
              className="relative flex h-[80px] cursor-pointer items-center rounded-md bg-white bg-center shadow-md"
              onClick={() => navigate(Page.Project, { state: { id: v.id } })}
            >
              <div
                className="h-[80px] w-[80px] rounded-l-md bg-contain bg-center"
                style={{
                  backgroundImage: v.info.coverFileUrl ? `url(${v.info.coverFileUrl})` : '',
                }}
              />
              <div className="m-4 w-fit rounded-lg bg-grey/70 p-2">{v.info.name}</div>
              <div>Owner: {v.collaborators.find((o) => o.role === Role.Owner)?.user.username}</div>
              {v.fileUrl && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <AudioPlayer
                    creation={{
                      id: v.id,
                      info: v.info,
                      fileUrl: v.fileUrl,
                      username:
                        v.collaborators.find((o) => o.role === Role.Owner)?.user.username ?? '',
                    }}
                  />
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default Overall;
