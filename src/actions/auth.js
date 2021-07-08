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
    if (email === "admin@ruangguru.com" && password === "admin") {
      const exp = Date.now() + 7200000;
      window.localStorage.setItem("exp", exp);
      dispatch(login.successLogin({}));
    } else {
      dispatch(login.failedLogin(404, {}));
    }
  };
};

const checkLogin = () => {
  return dispatch => {
    const exp = window.localStorage.getItem("exp");
    if (exp) {
      if (exp <= Date.now()) {
        alert("Session expired. Please login again!");
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
    window.localStorage.setItem("exp", 0);
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
