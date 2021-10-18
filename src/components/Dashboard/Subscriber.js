import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSubscription } from "urql";
import Packs from "../../store/packs";

const newMessages = `
subscription {
  newMeasurement {metric, at, value, unit}
}
`;

export default () => {
  const dispatch = useDispatch();
  const receiveMeasurement = useCallback(
    measurement =>
      dispatch({
        type: Packs.measurements.actions.MEASUREMENT_RECEIVED,
        measurement,
        metric: measurement.metric
      }),
    [dispatch]
  );
  const [subscriptionResponse] = useSubscription({ query: newMessages });
  const { data: subscriptionData } = subscriptionResponse;

  useEffect(
    () => {
      if (!subscriptionData) return;
      receiveMeasurement(subscriptionData.newMeasurement);
    },
    [subscriptionData, receiveMeasurement]
  );

  return null;
};
