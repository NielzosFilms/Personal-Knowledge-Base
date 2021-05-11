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
	// const [snackbar, setSnackbarState] = React.useState({});
	// const [open, setOpen] = React.useState(false);
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

	const setSnackbar = (item) => {
		// setSnackbarState(item);
		// setOpen(true);
	};

	// const handleClose = () => {
	// 	setOpen(false);
	// 	setSnackbarState({});
	// };

	if (authenticatedRes.loading || authUserRes.loading) {
		return <ThemeWrapper>Loading...</ThemeWrapper>;
	}

	if (authenticatedRes.error || authUserRes.error) {
		return <ThemeWrapper>Error :(</ThemeWrapper>;
	}

	return (
		<ThemeWrapper>
			<Switch>
				<Route path="/login">
					{authenticatedRes.data.isAuthenticated && (
						<Redirect to="/" />
					)}
					<Login setSnackbar={setSnackbar} />
				</Route>
				<Route path="/create-user">
					{authenticatedRes.data.isAuthenticated && (
						<Redirect to="/" />
					)}
					<CreateUser setSnackbar={setSnackbar} />
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
			{/* <Snackbar
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				ClickAwayListenerProps={{
					onClickAway: () => {},
				}}
			>
				<Alert severity={snackbar.severity || "info"}>
					{snackbar.message || "null"}
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={handleClose}
					>
						<Close fontSize="small" />
					</IconButton>
				</Alert>
			</Snackbar> */}
		</ThemeWrapper>
	);
}

export default App;
