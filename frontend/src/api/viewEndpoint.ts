import http from 'src/util/http';

const patchViewId = async (id: string) => await http.patch(`view/${id}`);

export default { patchViewId };
