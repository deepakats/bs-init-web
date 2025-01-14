import axios from "axios";

const path = "/projects";

const get = async () => axios.get(`${path}`);

const create = async (payload) => axios.post(`${path}`, payload);

const show = async (id, timeFrame = "week") => axios.get(`${path}/${id}?time_frame=${timeFrame}`);

const update = async (id, payload) => axios.patch(`${path}/${id}`, payload);

const destroy = async id => axios.delete(`${path}/${id}`);

const projectApi = { get, show, create, update, destroy };

export default projectApi;
