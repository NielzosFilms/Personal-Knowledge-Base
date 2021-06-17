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
import {useHistory, Redirect} from "react-router-dom";
import {useSnackbar} from "notistack";

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

export default function VerifyEmail({sendVerifyEmail}) {
	const [email, setEmail] = React.useState("");
	const classes = useStyles();
	const history = useHistory();
	const {enqueueSnackbar} = useSnackbar();

	const handleSubmit = async (e) => {
		e.preventDefault();
		sendVerifyEmail(email);
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
					<Link href="#" onClick={() => history.push("/login")}>
						Back to login
					</Link>
					<Typography variant="h3">Verify email</Typography>
					<form onSubmit={handleSubmit}>
						<FormControl className={classes.formContainer}>
							<TextField
								type="text"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								label="Email"
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
								Send Email
							</Button>
						</FormControl>
					</form>
				</Paper>
			</Container>
		</>
	);
}
