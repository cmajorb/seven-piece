import axios from "axios";
import { User } from "../types";
import { BASE_API } from '../config';
import Cookies from 'js-cookie';

class AuthService {
  setUserInLocalStorage(data: User) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  async login(username: string, password: string): Promise<User> {
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    const csrftoken = Cookies.get('csrftoken');
    const response = await axios.post(`${BASE_API.url}/log_activity/`, { username, password }, { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'csrf_token': csrftoken!, 'content-type': 'multipart/form-data' } });
    if (!response.data.token) {
      return response.data;
    }
    this.setUserInLocalStorage(response.data);
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const user = localStorage.getItem("user")!;
    return JSON.parse(user);
  }
}

export default new AuthService();