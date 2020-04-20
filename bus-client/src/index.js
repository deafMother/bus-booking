import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import App from "./components/App";
import history from "./history";
import reducer from "./reducer";
import rootSaga from "./saga/rootSaga";
import PopUp from "./components/PopUp/PupUp";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <div>
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </div>,
  document.getElementById("root")
);
