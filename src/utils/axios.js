import axios from 'axios';
import config from '../../config';

const requestAPI = (options) => {
  const { apikey } = config;
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
