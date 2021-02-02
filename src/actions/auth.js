import axios from "../utils/axios";

import config from "../../config";

const authTypes = {
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_ERROR: "LOGIN_ERROR",
  LOGIN_CONFIRMED: "LOGIN_CONFIRMED"
};

const login = {
  requestLogin: () => ({
    type: authTypes.LOGIN_REQUEST
  }),
  successLogin: payload => ({
    type: authTypes.LOGIN_SUCCESS,
    payload
  }),
  failedLogin: (code, error) => ({
    type: authTypes.LOGIN_ERROR,
    code,
    error
  }),
  confirmLoggedIn: isLogin => ({
    type: authTypes.LOGIN_CONFIRMED,
    isLogin
  })
};

const fetchLogin = ({ email, password }) => {
  return dispatch => {
    dispatch(login.requestLogin());

    axios({
      method: "post",
      url: `${config.apiUrl}qredit/v1/auth/portal/login`,
      data: {
        email,
        password
      }
    })
      .then(response => response.data.data)
      .then(data => {
        window.localStorage.setItem("user", JSON.stringify(data));
        dispatch(login.successLogin(data));
        window.location.reload();
      })
      .catch(err => {
        dispatch(
          login.failedLogin(err.response.data.status, err.response.data)
        );
      });
  };
};

const checkLogin = () => {
  return dispatch => {
    const data = JSON.parse(window.localStorage.getItem("user"));
    if (data) {
      const { exp } = data.info;
      const expirationDate = new Date(exp * 1000);
      if (expirationDate <= new Date()) {
        alert("Token expired. Please login again!");
        dispatch(login.confirmLoggedIn(false));
      } else {
        dispatch(login.confirmLoggedIn(true));
      }
    } else {
      dispatch(login.confirmLoggedIn(false));
    }
  };
};

const logout = () => {
  return dispatch => {
    window.localStorage.setItem("user", null);
    dispatch(login.confirmLoggedIn(false));
  };
};

const auth = {
  authTypes,
  fetchLogin,
  checkLogin,
  logout
};

export default auth;
