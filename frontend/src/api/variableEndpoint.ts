import { GetVariableParam, GetVariableResponse } from 'src/model/backend/api/Variable';
import http from 'src/util/http';

const getVariables = async (params: GetVariableParam) =>
  await http.get<GetVariableResponse, GetVariableParam>('variable', { params });

export default {
  getVariables,
};
