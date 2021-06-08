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
import {useSnackbar} from "notistack";
import {QUERY_USERS} from "../admin/queries";

// const CREATE_USER = gql`
// 	mutation CreateUser($token: String!, $name: String!, $password: String!) {
// 		createUser(token: $token, name: $name, password: $password) {
// 			id
// 		}
// 	}
// `;

const QUERY_USER = gql`
	query UserById($id: Int!, $token: String) {
		userById(id: $id, token: $token) {
			name
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

const UPDATE_USER = gql`
	mutation UpdateUser(
		$id: Int!
		$name: String
		$password: String
		$token: String
	) {
		updateUser(id: $id, name: $name, password: $password, token: $token) {
			id
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

export default function CreateUser() {
	const {user_id, token} = useParams();
	const {loading, error, data} = useQuery(VERIFY_TOKEN, {
		variables: {
			token,
		},
	});
	const userQueryResult = useQuery(QUERY_USER, {
		variables: {
			id: Number(user_id),
			token,
		},
	});
	const [updateUser, updateUserRes] = useMutation(UPDATE_USER);
	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const classes = useStyles();
	const history = useHistory();
	const {enqueueSnackbar} = useSnackbar();

	React.useEffect(() => {
		console.log(data);
		if (data?.verifyEmailToken?.success) {
			setEmail(data.verifyEmailToken.email);
		}
	}, [data]);

	React.useEffect(() => {
		if (userQueryResult.data) {
			setName(userQueryResult.data.userById.name);
		}
	}, [userQueryResult.loading]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (token && name) {
			updateUser({
				variables: {
					id: Number(user_id),
					token,
					name,
					...(password && {password}),
					token,
				},
			});
			enqueueSnackbar("Changes have been saved!", {variant: "success"});
			history.push("/login");
		} else {
			enqueueSnackbar("No values provided or incorrect.", {
				variant: "error",
			});
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
					<Typography variant="h3">Change account</Typography>
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
								className={classes.formComponent}
							/>
							<Button
								type="submit"
								color="secondary"
								variant="contained"
								className={classes.formComponent}
							>
								Update Account
							</Button>
						</FormControl>
					</form>
				</Paper>
			</Container>
		</>
	);
}
