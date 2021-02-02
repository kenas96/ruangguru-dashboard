import { auth as authAction } from '../actions';

const initialState = {
  loading: false,
  data: null,
  errCode: 0,
  error: null
};

const auth = (state = initialState, action) => {
  const { authTypes } = authAction;
  switch (action.type) {
    case authTypes.LOGIN_REQUEST:
      return Object.assign({}, state, {
        loading: true
      });
    case authTypes.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLogin: true,
        loading: false,
        data: action.payload,
        error: null,
        errCode: 0
      });
    case authTypes.LOGIN_ERROR:
      return Object.assign({}, state, {
        loading: false,
        errCode: action.code,
        error: action.error
      });
    case authTypes.LOGIN_CONFIRMED:
      return Object.assign({}, state, {
        isLogin: action.isLogin
      });
    default:
      return state;
  }
};

export default auth;
