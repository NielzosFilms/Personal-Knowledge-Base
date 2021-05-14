import React from "react";
import {useQuery, gql} from "@apollo/client";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {Snackbar, IconButton} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {Close} from "@material-ui/icons";
import CssBaseline from "@material-ui/core/CssBaseline";

import {Route, Switch, useHistory, Redirect} from "react-router-dom";

import Layout from "../Layout";
import Login from "../components/Login";
import NotesList from "../components/markdown/List";
import Markdown from "../components/markdown/Markdown";
import Welcome from "../components/Welcome";

import UserList from "../components/admin/UserList";
import EditUser from "../components/admin/EditUser";
import CreateUser from "../components/user/CreateUser";
import VerifyEmail from "../components/user/VerifyEmail";

import AuthenticatedUserProvider from "../services/AuthenticatedUserProvider";

const AUTHENTICATED = gql`
	query {
		isAuthenticated
	}
`;

const AUTH_USER = gql`
	query {
		getAuthenticatedUser {
			name
			admin
		}
	}
`;

function App() {
	const authenticatedRes = useQuery(AUTHENTICATED);
	const authUserRes = useQuery(AUTH_USER);
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	const history = useHistory();

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

	history.listen(() => {
		authenticatedRes.refetch();
		authUserRes.refetch();
	});

	const ThemeWrapper = ({children}) => (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);

	if (authenticatedRes.loading || authUserRes.loading) {
		return <ThemeWrapper>Loading...</ThemeWrapper>;
	}

	if (authenticatedRes.error || authUserRes.error) {
		return <ThemeWrapper>Error :(</ThemeWrapper>;
	}

	return (
		<ThemeWrapper>
			<Switch>
				<Route exact path="/login">
					{authenticatedRes.data.isAuthenticated && (
						<Redirect to="/" />
					)}
					<Login />
				</Route>
				<Route exact path="/create-user">
					{authenticatedRes.data.isAuthenticated && (
						<Redirect to="/" />
					)}
					<VerifyEmail />
				</Route>
				<Route exact path="/create-user/token/:token">
					{authenticatedRes.data.isAuthenticated && (
						<Redirect to="/" />
					)}
					<CreateUser />
				</Route>
				{!authenticatedRes.data.isAuthenticated && (
					<Redirect to="/login" />
				)}
				<Layout>
					<Route exact path="/notes">
						<NotesList />
					</Route>
					{/* <Route axact path="/notes" component={NotesList} /> */}
					<Route exact path="/notes/new">
						<Markdown isNew />
					</Route>

					<Route exact path="/notes/edit/:id" component={Markdown} />

					<Route path="/admin">
						{authUserRes.data?.getAuthenticatedUser &&
							!authUserRes.data.getAuthenticatedUser.admin && (
								<Redirect to="/" />
							)}
					</Route>
					<Route exact path="/admin/users" component={UserList} />
					<Route exact path="/admin/users/edit/:id">
						<AuthenticatedUserProvider>
							<EditUser />
						</AuthenticatedUserProvider>
					</Route>

					<Route exact path="/" component={Welcome} />
				</Layout>
			</Switch>
		</ThemeWrapper>
	);
}

export default App;
