import jwtDecode from 'jwt-decode';
import { verify, sign } from 'jsonwebtoken';
import { BASE_API } from '../config';
//
import axios from 'axios';

// ----------------------------------------------------------------------

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

//  const handleTokenExpired = (exp) => {
//   let expiredTimer;

//   window.clearTimeout(expiredTimer);
//   const currentTime = Date.now();
//   const timeLeft = exp * 1000 - currentTime;
//   expiredTimer = window.setTimeout(() => {
//     // You can do what ever you want here, like show a notification
//   }, timeLeft);
// };

const setSession = (accessToken: string | null, refresh: string | null) => {
  if (accessToken && refresh) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refresh);
    axios.defaults.headers.common.Authorization = `JWT ${accessToken}`;
    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // handleTokenExpired(exp);
  } else if (refresh) {
    localStorage.setItem('refreshToken', refresh);
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const refreshAccessToken = async (refreshToken: string | null) => {
  let credentials = { access: '', refresh: refreshToken };
  await axios.post(`${BASE_API.url}/token_refresh/`, { refresh: refreshToken }).then((response) => {
    const { access, refresh } = response.data;
    setSession(access, refresh);
    credentials = { ...response.data };
  }).catch(err => {
    console.error(err);
  });
  return { ...credentials };
}

const getAdminToken = async () => {
  let credentials = { access: '', refresh: '' };
  await axios.get(`${BASE_API.url}/get_admin_tokens/`).then((response) => {
    const { access, refresh } = response.data;
    console.log('got tokens')
    setSession(access, refresh);
    credentials = { ...response.data };
  }).catch(err => {
    console.error(err);
  });
  return { ...credentials };
}
export { isValidToken, setSession, verify, sign, refreshAccessToken, getAdminToken };
