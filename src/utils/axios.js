import axios from "axios";

const requestAPI = options => {
  const apikey = `${process.env.REACT_APP_SERVER_API_KEY}`;
  const reqOptionsHeader = {
    ...options.headers,
    apikey
  };

  return axios({
    ...options,
    headers: reqOptionsHeader
  });
};

export default requestAPI;
