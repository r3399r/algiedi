import http from 'src/util/http';

const getProject = async () => await http.authGet<any>('project');

export default {
  getProject,
};
