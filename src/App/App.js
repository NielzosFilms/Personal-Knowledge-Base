import React from "react";
import { useQuery, gql } from "@apollo/client";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Layout from "../Layout";
import Login from "../components/Login";

const AUTHENTICATED = gql`
    query {
        isAuthenticated
    }
`;

function App() {
    const { loading, error, data } = useQuery(AUTHENTICATED);
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    const theme = React.useMemo(
        () =>
            createMuiTheme({
                palette: {
                    primary: {
                        main: "#A1469E",
                    },
                    secondary: {
                        main: "#02A699",
                    },
                    type: prefersDarkMode ? "dark" : "light",
                },
            }),
        [prefersDarkMode]
    );

    const ThemeWrapper = ({ children }) => (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );

    if (loading) {
        return <ThemeWrapper>Loading...</ThemeWrapper>;
    }

    if (error) {
        return <ThemeWrapper>Error :(</ThemeWrapper>;
    }

    if (!data.isAuthenticated) {
        return (
            <ThemeWrapper>
                <Login />
            </ThemeWrapper>
        );
    }

    return (
        <Router>
            <ThemeWrapper>
                <Layout>
                    <Switch>
                        <Route path="/ping">Pong</Route>
                        <Route path="/">index</Route>
                    </Switch>
                </Layout>
            </ThemeWrapper>
        </Router>
    );
}

export default App;
