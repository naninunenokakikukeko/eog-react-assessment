import produce from "immer";
import { TimeSeries } from "pondjs";
// import makeReducer from "@eog/redux-make-reducer";
import makeReducer from "../../../redux-make-reducer";
import * as actions from "./actions";

const initialState = {};

const receiveMultipleMeasurements = (state, action) =>
  produce(state, draftState => {
    draftState = action.getMultipleMeasurements.reduce((accum, elem) => {
      const { metric, measurements } = elem;
      const points = measurements.map(m => [m.at, m.value, m.unit]);

      const series = new TimeSeries({
        name: metric,
        columns: ["time", "value", "unit"],
        points
      });

      if (!accum[metric]) {
        accum[metric] = series;
      } else {
        accum[metric] = TimeSeries.timeSeriesListMerge({
          name: metric,
          seriesList: [accum[metric], series]
        });
      }

      return accum;
    }, draftState);
    return draftState;
  });

const receiveSingleMeasurement = (state, action) => {
  const { metric, measurement } = action;
  const { at, value, unit } = measurement;
  const points = [[at, value, unit]];
  const series = new TimeSeries({
    name: metric,
    columns: ["time", "value", "unit"],
    points
  });

  return produce(state, draftState => {
    if (!draftState[metric]) {
      draftState[metric] = series;
    } else {
      draftState[metric] = TimeSeries.timeSeriesListMerge({
        name: metric,
        seriesList: [draftState[metric], series]
      });
    }
  });
};

const handlers = {
  [actions.MULTIPLE_MEASUREMENTS_RECEIVED]: receiveMultipleMeasurements,
  [actions.MEASUREMENT_RECEIVED]: receiveSingleMeasurement
};

export default makeReducer(handlers, initialState);
