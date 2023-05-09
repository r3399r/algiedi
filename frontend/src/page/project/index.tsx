import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getProject } from 'src/service/ProjectService';

const Project = () => {
  const dispatch = useDispatch();
  const [trackUrl, setTrackUrl] = useState<string>();

  useEffect(() => {
    getProject()
      .then((res) => setTrackUrl(res?.url ?? 'xx'))
      .catch((err) => dispatch(openFailSnackbar(err)));
  }, []);

  const onLoadMetadata = (e: ChangeEvent<HTMLAudioElement>) => {
    console.log(e.target.duration);
  };

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
