import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import App from "./App";
import "./styles/main.scss";
import rootReducer from "./reducers/index";
import * as serviceWorker from "./serviceWorker";

let store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}

serviceWorker.unregister();
