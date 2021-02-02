import { combineReducers } from "redux";
import auth from "./auth";
import uploadImages from "./uploadImage.reducer";

const rootReducer = combineReducers({
  auth,
  uploadImages
});

export default rootReducer;
