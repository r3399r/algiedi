import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GetProjectResponse } from 'src/model/backend/model/api/Project';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getLatestProject } from 'src/service/ProjectService';

const Project = () => {
  const dispatch = useDispatch();
  const [myProject, setMyProject] = useState<GetProjectResponse[0] | null>();
  const [trackUrl, setTrackUrl] = useState<string>();

  useEffect(() => {
    getLatestProject()
      .then((res) => setMyProject(res))
      .catch((err) => dispatch(openFailSnackbar(err)));
  }, []);

  const onLoadMetadata = (e: ChangeEvent<HTMLAudioElement>) => {
    console.log(e.target.duration);
  };

  if (myProject === null) return <>Please upload a content first.</>;

  return (
    <>
      <div className="text-[20px] mb-10">Project</div>
      <div className="bg-white rounded-xl p-10">
        <div />
        {trackUrl && <audio src={trackUrl} controls onLoadedMetadata={onLoadMetadata} />}
      </div>
    </>
  );
};

export default Project;
