import produce from "immer";
// import makeReducer from "@eog/redux-make-reducer";
import makeReducer from "../../../redux-make-reducer";
import * as actions from "./actions";

const initialState = {
  loading: true,
  metrics: []
};

const handlers = {
  [actions.METRICS_RECEIVED]: (state, action) => {
    return produce(state, draftState => ({
      loading: false,
      metrics: action.metrics
    }));
  }
};

export default makeReducer(handlers, initialState);
