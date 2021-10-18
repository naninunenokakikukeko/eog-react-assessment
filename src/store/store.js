import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import Packs from "./packs";

export default () => {
  const history = createBrowserHistory();
  const sagaMiddleware = createSagaMiddleware();

  const appReducer = combineReducers(
    {
      router: connectRouter(history),
      ...Object.keys(Packs).reduce((accum, key) => {
        accum[key] = Packs[key].reducer;
        return accum;
      }, {})
    },
    {}
  );

  const routerMiddlewareWithHistory = routerMiddleware(history);
  const composeEnhancers = composeWithDevTools({});

  const middlewares = applyMiddleware(
    sagaMiddleware,
    routerMiddlewareWithHistory
  );
  const enhancers = composeEnhancers(middlewares);
  const store = createStore(appReducer, enhancers);

  Object.keys(Packs).forEach(key => {
    Packs[key].sagas.map(sagaMiddleware.run);
  });

  return { store, history };
};
