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

const SEND_EMAIL = gql`
	mutation SendEmail($email: String!) {
		sendVerifyEmail(email: $email)
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

export default function VerifyEmail({setSnackbar}) {
	const [sendEmail, sendEmailRes] = useMutation(SEND_EMAIL);
	const [email, setEmail] = React.useState("");
	const [open, setOpen] = React.useState(false);
	const [openSuccess, setOpenSuccess] = React.useState(false);
	const classes = useStyles();
	const history = useHistory();

	const handleSubmit = async (e) => {
		e.preventDefault();
		sendEmail({
			variables: {
				email,
			},
		}).catch((error) => {
			console.error(error);
		});
	};

	React.useEffect(() => {
		console.log(sendEmailRes);
		if (sendEmailRes.error) {
			setOpen(true);
		}
		if (sendEmailRes.data?.sendVerifyEmail) {
			setOpenSuccess(true);
		}
	}, [sendEmailRes.loading]);

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
						{sendEmailRes.loading && (
							<Typography>Sending email...</Typography>
						)}
					</form>
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
					{sendEmailRes.error &&
						sendEmailRes.error.graphQLErrors[0].message}
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
			<Snackbar
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				open={openSuccess}
				autoHideDuration={4500}
				onClose={() => setOpenSuccess(false)}
			>
				<Alert severity="success">
					The email has been sent, please check your inbox! (it could
					be in the spam folder)
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={() => setOpenSuccess(false)}
					>
						<Close fontSize="small" />
					</IconButton>
				</Alert>
			</Snackbar>
		</>
	);
}
