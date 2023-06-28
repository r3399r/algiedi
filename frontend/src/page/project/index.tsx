import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Status } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getProject } from 'src/service/ProjectService';
import Collaborate from './Collaborate';
import Prepare from './Prepare';

const Project = () => {
  const dispatch = useDispatch();
  const state = useLocation().state as { id: string } | null;
  const [thisProject, setThisProject] = useState<DetailedProject | null>();
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    getProject(state?.id)
      .then((res) => setThisProject(res))
      .catch((err) => dispatch(openFailSnackbar(err)));
  }, [state?.id, refresh]);

  if (thisProject === null) return <>Please upload a content first.</>;
  if (thisProject === undefined) return <>Loading...</>;

  if (thisProject.status === Status.Created)
    return <Prepare project={thisProject} doRefresh={() => setRefresh(!refresh)} />;

  return <Collaborate project={thisProject} doRefresh={() => setRefresh(!refresh)} />;
};

export default Project;
