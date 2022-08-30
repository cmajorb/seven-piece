import axios from 'axios';
// config
import { BASE_API } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: BASE_API.url,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
