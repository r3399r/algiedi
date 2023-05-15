import { useEffect } from 'react';
import { getMyProjects } from 'src/service/OverallService';

const Overall = () => {
  useEffect(() => {
    getMyProjects();
  }, []);

  return <>ss</>;
};

export default Overall;
