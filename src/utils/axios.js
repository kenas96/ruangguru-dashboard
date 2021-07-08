import axios from "axios";

const requestAPI = options => {
  const reqOptionsHeader = {
    ...options.headers
  };

  return axios({
    ...options,
    headers: reqOptionsHeader
  });
};

export default requestAPI;
