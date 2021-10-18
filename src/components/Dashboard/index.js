import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Chart from "./Chart";
import Metric from "./Metric";
import Subscriber from "./Subscriber";
import MetricSelection from "./MetricSelection";
import Packs from "../../store/packs";

const useStyles = makeStyles({
  wrapper: {
    height: "100vh"
  },
  header: {
    display: "flex",
    width: "100%"
  },
  metrics: {
    width: "60%",
    display: "flex",
    flexWrap: "wrap"
  },
  selection: {
    width: "40%"
  }
});

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const setMetrics = metrics =>
    dispatch({ type: Packs.metrics.actions.METRICS_RECEIVED, metrics });
  const metrics = useSelector(Packs.metrics.selectors.getMetrics);

  return (
    <div className={classes.wrapper}>
      <Subscriber />
      <div className={classes.header}>
        <div className={classes.metrics}>
          {metrics.map((m, i) => (
            <Metric metric={m} key={m} />
          ))}
        </div>
        <div className={classes.selection}>
          <MetricSelection selectedMetrics={metrics} setMetrics={setMetrics} />
        </div>
      </div>
      <Chart />
    </div>
  );
};

export default Dashboard;
