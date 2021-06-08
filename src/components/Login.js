import React from "react";
import {useQuery, useLazyQuery, gql, useMutation} from "@apollo/client";
import {
	TextField,
	Button,
	Paper,
	Container,
	FormControl,
	Grid,
	AppBar,
	Toolbar,
	Typography,
	Snackbar,
	IconButton,
	Link,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	CircularProgress,
	Box,
} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import {Close} from "@material-ui/icons";
import {useHistory, Redirect} from "react-router-dom";
import {useSnackbar} from "notistack";

const LOGIN_QUERY = gql`
	query Login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			success
			token
		}
	}
`;

const CHANGE_PASSWORD_MUTATION = gql`
	mutation SendChangePasswordEmail($email: String!) {
		sendChangePasswordEmail(email: $email)
	}
`;

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(12),
	},
	paper: {
		margin: theme.spacing(3),
		marginLeft: "auto",
		marginRight: "auto",
		padding: theme.spacing(4),
		width: "fit-content",
	},
	formComponent: {
		margin: theme.spacing(1.5),
	},
}));

export default function Login() {
	const [execLogin, loginResult] = useLazyQuery(LOGIN_QUERY);
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const classes = useStyles();
	const history = useHistory();
	const [open, setOpen] = React.useState(false);
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [emailOpen, setEmailOpen] = React.useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		execLogin({
			variables: {
				username,
				password,
			},
		});
	};

	React.useEffect(() => {
		if (loginResult.data) {
			if (loginResult.data.login.success) {
				localStorage.removeItem("token");
				localStorage.removeItem("breadCrums");
				localStorage.removeItem("folderId");
				localStorage.removeItem("noteHistory");
				localStorage.setItem("token", loginResult.data.login.token);
				history.push("/");
				enqueueSnackbar("You are now logged in!", {variant: "success"});
			}
		}
		if (loginResult.error) {
			enqueueSnackbar(loginResult.error.graphQLErrors[0].message, {
				variant: "error",
			});
		}
	}, [loginResult.loading]);

	return (
		<>
			<AppBar position="fixed" color="primary">
				<Toolbar>
					<Typography variant="h6" noWrap>
						Knowledge Base
					</Typography>
				</Toolbar>
			</AppBar>
			<Container className={classes.root}>
				<Paper className={classes.paper}>
					<Typography variant="h3">Login</Typography>
					<form onSubmit={handleSubmit}>
						<FormControl>
							<TextField
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								label="Username"
								variant="filled"
								size="small"
								required
								className={classes.formComponent}
							/>
							<TextField
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								label="Password"
								variant="filled"
								size="small"
								required
								className={classes.formComponent}
							/>
							<Button
								type="submit"
								color="secondary"
								variant="contained"
								className={classes.formComponent}
							>
								Login
							</Button>
						</FormControl>
					</form>
					<Box display="flex" flexDirection="column">
						<Link
							href="#"
							onClick={() => history.push("/create-user")}
						>
							Create account
						</Link>
						<Link href="#" onClick={() => setEmailOpen(true)}>
							Reset password
						</Link>
					</Box>
				</Paper>
			</Container>
			<Snackbar
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				open={open}
				autoHideDuration={4500}
				onClose={() => setOpen(false)}
			>
				<Alert severity="error">
					Username and or password is incorrect.
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={() => setOpen(false)}
					>
						<Close fontSize="small" />
					</IconButton>
				</Alert>
			</Snackbar>
			<ChangePasswordDialog open={emailOpen} setOpen={setEmailOpen} />
		</>
	);
}

function ChangePasswordDialog({open, setOpen}) {
	const [sendEmail, sendEmailRes] = useMutation(CHANGE_PASSWORD_MUTATION);
	const [email, setEmail] = React.useState("");
	const {enqueueSnackbar} = useSnackbar();

	const handleClose = () => {
		setEmail("");
		setOpen(false);
	};

	const handleSubmit = () => {
		if (!email) {
			enqueueSnackbar("No email given.", {variant: "warning"});
		}
		sendEmail({variables: {email}});
	};

	React.useEffect(() => {
		if (sendEmailRes.error) {
			enqueueSnackbar(sendEmailRes.error.message, {variant: "error"});
		}
		if (sendEmailRes?.data?.sendChangePasswordEmail) {
			enqueueSnackbar(`Email has been sent to ${email}`, {
				variant: "info",
			});
			handleClose();
		}
	}, [sendEmailRes.loading]);

	return (
		<>
			<Dialog open={open} onClose={handleClose} fullWidth>
				<DialogTitle>Reset password / change username</DialogTitle>
				<DialogContent>
					<TextField
						label="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						fullWidth
						autoFocus
					/>
				</DialogContent>
				<DialogActions>
					<Box
						width="100%"
						display="flex"
						justifyContent="space-between"
					>
						<Button color="primary" onClick={handleClose}>
							Close
						</Button>
						<Button color="primary" onClick={handleSubmit}>
							Send email
						</Button>
					</Box>
				</DialogActions>
			</Dialog>
			{sendEmailRes?.loading && (
				<Box position="absolute" style={{bottom: 10, left: 10}}>
					<CircularProgress color="primary" />
				</Box>
			)}
		</>
	);
}
