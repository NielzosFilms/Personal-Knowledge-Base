import React from "react";
import { useQuery, gql } from "@apollo/client";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { Route, Switch, useHistory, Redirect } from "react-router-dom";

import Layout from "../Layout";
import Login from "../components/Login";
import Markdown from "../components/markdown/Markdown";
import Welcome from "../components/Welcome";

const AUTHENTICATED = gql`
    query {
        isAuthenticated
    }
`;

function App() {
    const { loading, error, data, refetch } = useQuery(AUTHENTICATED);
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [updateTime, setUpdateTime] = React.useState(new Date());

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

    React.useEffect(() => {
        refetch();
    }, [updateTime]);

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

    return (
        <ThemeWrapper>
            <Switch>
                <Route path="/login">
                    {data.isAuthenticated && <Redirect to="/" />}
                    <Login setUpdateTime={setUpdateTime} />
                </Route>
                <Route path="/">
                    {!data.isAuthenticated && <Redirect to="/login" />}
                    <Switch>
                        <Layout setUpdateTime={setUpdateTime}>
                            <Route path="/markdown">
                                <Markdown />
                            </Route>
                            <Route path="/">
                                <Welcome />
                            </Route>
                        </Layout>
                    </Switch>
                </Route>
            </Switch>
        </ThemeWrapper>
    );
}

export default App;
