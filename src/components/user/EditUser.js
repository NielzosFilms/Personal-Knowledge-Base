import React from "react";
import {gql} from "@apollo/client";
import {
	TextField,
	Button,
	Paper,
	Container,
	FormControl,
	AppBar,
	Toolbar,
	Typography,
} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import {useHistory, useParams} from "react-router-dom";
import {useSnackbar} from "notistack";

import {DataProvider, MutationProvider} from "../../services";

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

export default function EditUserWrapper() {
	const {user_id, token} = useParams();

	return (
		<DataProvider query={VERIFY_TOKEN} variables={{token}}>
			<DataProvider
				query={QUERY_USER}
				variables={{id: Number(user_id), token}}
			>
				<MutationProvider
					mutation={UPDATE_USER}
					returnName="updateUser"
				>
					<EditUser user_id={Number(user_id)} token={token} />
				</MutationProvider>
			</DataProvider>
		</DataProvider>
	);
}

function EditUser({
	userById,
	verifyEmailToken,
	updateUser,
	updateUserRes,
	user_id,
	token,
}) {
	const [name, setName] = React.useState(userById.data.userById.name);
	const [email, setEmail] = React.useState(
		verifyEmailToken.data.verifyEmailToken.email
	);
	const [password, setPassword] = React.useState("");
	const classes = useStyles();
	const history = useHistory();
	const {enqueueSnackbar} = useSnackbar();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (token && name) {
			updateUser({
				variables: {
					id: user_id,
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

	return (
		<>
			<AppBar position="fixed" color="primary">
				<Toolbar>
					<Typography variant="h6" noWrap>
						EXO
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
