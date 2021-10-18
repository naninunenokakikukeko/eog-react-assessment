import React from "react";
import { Query } from "urql";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const query = `query {getMetrics}`;

const animatedComponents = makeAnimated();

export default props => {
  const { setMetrics, selectedMetrics } = props;
  const onChange = metrics => {
    setMetrics((metrics || []).map(({ value }) => value));
  };
  return (
    <Query query={query}>
      {({ fetching, data, error }) => {
        if (fetching) {
          return "Loading...";
        } else if (error) {
          return "Oh no!";
        } else if (!data) {
          return "No data";
        }

        const metrics = data.getMetrics.map(metric => ({
          value: metric,
          label: metric
        }));

        return (
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            defaultOptions={selectedMetrics}
            onChange={onChange}
            options={metrics}
          />
        );
      }}
    </Query>
  );
};
