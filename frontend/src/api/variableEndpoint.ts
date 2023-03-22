import { GetVariableParam, GetVariableResponse } from 'src/model/api/Variable';
import http from 'src/util/http';

const getVariable = async (params: GetVariableParam) =>
  await http.authGet<GetVariableResponse, GetVariableParam>('variable', { params });

export default {
  getVariable,
};
