import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { GetProjectResponse } from 'src/model/backend/api/Project';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getProject } from 'src/service/ProjectService';

const Project = () => {
  const dispatch = useDispatch();
  const state = useLocation().state as { id: string } | null;
  const [myProject, setMyProject] = useState<GetProjectResponse[0] | null>();
  const [trackUrl, setTrackUrl] = useState<string>();

  useEffect(() => {
    getProject(state?.id)
      .then((res) => setMyProject(res))
      .catch((err) => dispatch(openFailSnackbar(err)));
  }, [state?.id]);

  const onLoadMetadata = (e: ChangeEvent<HTMLAudioElement>) => {
    console.log(e.target.duration);
  };

  if (myProject === null) return <>Please upload a content first.</>;

  return (
    <>
      <div className="text-[20px] mb-10">Project</div>
      <div className="bg-white rounded-xl p-10">
        <div>{myProject?.id}</div>
        {trackUrl && <audio src={trackUrl} controls onLoadedMetadata={onLoadMetadata} />}
      </div>
    </>
  );
};

export default Project;
