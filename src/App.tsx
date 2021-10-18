import React from 'react';
import { Provider } from "react-redux";
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import {
  Provider as UrqlProvider,
  createClient,
  defaultExchanges,
  subscriptionExchange,
} from 'urql';
import 'react-toastify/dist/ReactToastify.css';
import { ExecutionResult } from '@urql/core';
import { ObservableLike } from '@urql/core/dist/types/exchanges/subscription';
import createStore from "./store/store";
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import NowWhat from './components/NowWhat';
import Dashboard from './components/Dashboard';

const { store, history } = createStore();

const subscriptionClient = new SubscriptionClient(
  //  `${process.env.NODE_ENV === "production" ? "wss" : "ws"}://${
  //    window.location.host
  //  }/graphql`,
  `${process.env.NODE_ENV === 'production' ? 'wss' : 'ws'}://react.eogresources.com/graphql`,
  {
    reconnect: true,
    timeout: 20000,
  },
);

const client = createClient({
  // url: "/graphql",
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation =>
        subscriptionClient.request(operation) as ObservableLike<ExecutionResult>,
    }),
  ],
});

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

const App = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Wrapper>
        <UrqlProvider value={client}>
          <Header />
          <NowWhat />
          <Dashboard />
        </UrqlProvider>
        <ToastContainer />
      </Wrapper>
    </MuiThemeProvider>
  </Provider>
);

export default App;
