import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App/App";
import reportWebVitals from "./reportWebVitals";

import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";

const host = process.env.REACT_APP_APOLLO_CLIENT_HOST || "localhost";
const port = process.env.REACT_APP_APOLLO_CLIENT_PORT || "8080";

const httpLink = createHttpLink({
  uri: `http://${host}:${port}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token || "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
