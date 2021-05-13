import React from "react";
import {useQuery, useMutation, gql} from "@apollo/client";
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
} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import {Close} from "@material-ui/icons";
import {useHistory, Redirect, useParams} from "react-router-dom";
import VerifyEmail from "./VerifyEmail";

const CREATE_USER = gql`
	mutation CreateUser($token: String!, $name: String!, $password: String!) {
		createUser(token: $token, name: $name, password: $password) {
			id
		}
	}
`;

const VERIFY_TOKEN = gql`
	query VerifyToken($token: String!) {
		verifyEmailToken(token: $token) {
			success
			email
		}
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
	formContainer: {
		width: "100%",
	},
}));

export default function CreateUser({setSnackbar}) {
	const {token} = useParams();
	const {loading, error, data} = useQuery(VERIFY_TOKEN, {
		variables: {
			token,
		},
	});
	const [createUser, createUserRes] = useMutation(CREATE_USER);
	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const classes = useStyles();
	const history = useHistory();

	React.useEffect(() => {
		console.log(data);
		if (data?.verifyEmailToken?.success) {
			setEmail(data.verifyEmailToken.email);
		}
	}, [data]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (token && name && password) {
			createUser({
				variables: {
					token,
					name,
					password,
				},
			});
			history.push("/login");
		} else {
			console.log("values not provided/incorrect");
		}
	};

	if (loading) return <>Loading...</>;
	if (error) return <>Error :( (Or invalid token)</>;

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
					<Link href="#" onClick={() => history.push("/login")}>
						Back to login
					</Link>
					<Typography variant="h3">Create account</Typography>
					<form onSubmit={handleSubmit}>
						<FormControl className={classes.formContainer}>
							<TextField
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								label="Username"
								variant="filled"
								size="small"
								required
								className={classes.formComponent}
							/>
							<TextField
								type="text"
								disabled
								value={email}
								label="Email"
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
								Create Account
							</Button>
						</FormControl>
					</form>
				</Paper>
			</Container>
		</>
	);
}
