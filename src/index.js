import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App/App";
import reportWebVitals from "./reportWebVitals";

import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

// const env = process.env.NODE_ENV || "development";

const host = process.env.REACT_APP_APOLLO_CLIENT_URI || "localhost";
const port = process.env.REACT_APP_APOLLO_CLIENT_PORT || "8080";

const client = new ApolloClient({
  uri: `http://${host}:${port}/graphql`,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
