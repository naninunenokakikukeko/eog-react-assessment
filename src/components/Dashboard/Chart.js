import React, { useState, useEffect, useCallback } from "react";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  styler,
  Resizable
} from "react-timeseries-charts";
import { useQuery } from "urql";
import { useDispatch, useSelector } from "react-redux";
import Packs from "../../store/packs";

const query = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
      value
      metric
      unit
    }
  }
}
`;

const colors = [
  "#581845",
  "#C70039",
  "#FF5733",
  "#FFC300",
  "#900C3F",
  "#DAF7A6"
];

const calcThirtyMinutesAgo = () => new Date() - 30 * 60 * 1000;
const thirtyMinutesAgo = calcThirtyMinutesAgo();

export default (props) => {
  const dispatch = useDispatch();
  const metrics = useSelector(Packs.metrics.selectors.getMetrics);
  const axis = useSelector(Packs.measurements.selectors.getAxis);
  const series = useSelector(Packs.measurements.selectors.getSeries);
  const trafficSeries = useSelector(
    Packs.measurements.selectors.getTrafficSeries
  );

  const receiveMultipleMeasurements = useCallback(
    getMultipleMeasurements =>
      dispatch({
        type: Packs.measurements.actions.MULTIPLE_MEASUREMENTS_RECEIVED,
        getMultipleMeasurements
      }),
    [dispatch]
  );

  const [queryResult] = useQuery(
    {
      query,
      variables: {
        input: metrics.map(metricName => ({
          metricName,
          after: thirtyMinutesAgo
        }))
      }
    },
    [metrics]
  );
  useEffect(
    () => {
      const { data } = queryResult;
      if (!data) return;
      receiveMultipleMeasurements(data.getMultipleMeasurements);
    },
    [queryResult, receiveMultipleMeasurements]
  );

  const [tracker, setTracker] = useState(null);
  const [trackerInfo, setTrackerInfo] = useState([]);

  const onTrackerChanged = t => {
    setTracker(t);
    if (!t) {
      setTrackerInfo([]);
    } else {
      setTrackerInfo(
        series.map(s => {
          const i = s.bisect(new Date(t));
          return {
            label: s.name(),
            value: s
              .at(i)
              .get("value")
              .toString()
          };
        })
      );
    }
  };

  if (!series || series.length === 0) return null;

  return (
    <Resizable>
      <ChartContainer
        timeRange={trafficSeries.timerange([
          calcThirtyMinutesAgo(),
          new Date().getTime()
        ])}
        onTrackerChanged={onTrackerChanged}
        trackerPosition={tracker}
      >
        <ChartRow
          height={500}
          trackerShowTime={true}
          trackerInfoValues={trackerInfo}
          trackerInfoHeight={10 + trackerInfo.length * 16}
          trackerInfoWidth={140}
        >
          {axis.map((metricSeries, i) => (
            <YAxis
              key={i}
              id={metricSeries.id}
              label={metricSeries.label}
              min={metricSeries.min}
              max={metricSeries.max}
              width="60"
              type="linear"
            />
          ))}
          <Charts>
            {series.map((metricSeries, i) => {
              const style = styler(
                series.map(s => ({
                  key: "value",
                  color: colors[i],
                  selected: "#2CB1CF"
                }))
              );

              return (
                <LineChart
                  key={i}
                  style={style}
                  axis={metricSeries.atLast().get("unit")}
                  series={metricSeries}
                  column={["value"]}
                />
              );
            })}
          </Charts>
        </ChartRow>
      </ChartContainer>
    </Resizable>
  );
};
