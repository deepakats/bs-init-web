import axios from "axios";

const path = "/internal_api/v1/companies";

const index = () => axios.get(path);

const create = payload => axios.post(path, payload);

const update = (id, payload) => axios.put(`${path}/${id}`, payload);

const destroy = id => axios.delete(`${path}/${id}`);

const removeLogo = id => axios.delete(`${path}/${id}/purge_logo`);

const companiesApi = {
  index,
  create,
  update,
  destroy,
  removeLogo
};

export default companiesApi;
