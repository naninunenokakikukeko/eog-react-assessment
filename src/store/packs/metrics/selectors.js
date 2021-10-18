import { createSelector } from "reselect";

const state = state => state.metrics;

export const getIsLoading = createSelector(state, state => state.loading);
export const getMetrics = createSelector(state, state => state.metrics);
