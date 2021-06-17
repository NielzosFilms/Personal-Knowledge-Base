import {useState} from "react";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	Box,
	Typography,
	IconButton,
	Tooltip,
	Link,
	Grid,
	Divider,
	TableContainer,
	Table,
	TableRow,
	TableCell,
	TableHead,
	TableBody,
} from "@material-ui/core";
import {SearchOutlined, Folder} from "@material-ui/icons";
import {Autocomplete} from "@material-ui/lab";
import {useSnackbar} from "notistack";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	divider: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
}));

export default function About() {
	const [open, setOpen] = useState(false);
	const classes = useStyles();
	const history = useHistory();

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Link
				onClick={() => setOpen(true)}
				style={{cursor: "pointer"}}
				color="secondary"
			>
				About
			</Link>
			<Dialog open={open} onClose={handleClose} fullWidth>
				<DialogTitle>About EXO</DialogTitle>
				<DialogContent>
					<Typography variant="h5">Creator</Typography>
					<Divider className={classes.divider} />
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Typography variant="h5">NielzosFilms</Typography>
							<Typography variant="body2">
								Niels Hazelaar
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Box display="flex" flexDirection="column">
								<Link
									href="https://github.com/NielzosFilms"
									color="secondary"
									target="blank"
								>
									Github
								</Link>
								<Link
									href="https://www.youtube.com/channel/UC_jDDlAiXW5tS0agiuwEmng"
									color="secondary"
									target="blank"
								>
									Youtube
								</Link>
								<Link
									href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQF8-WACJTQYywAAAXobO5cAdTLIsoAekYZsk9mwdy0t-647-u9xwA7WrRNhOo5if1DYfFQIw4M2kR04xN7c9UfPK2ph8GJ2ktRzgIX5eBvDqgUXQgrRgwHkRj1zJfC1_A3MQNQ=&originalReferer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fniels-hazelaar-24790b146%2F"
									color="secondary"
									target="blank"
								>
									Linkedin
								</Link>
								<Link
									href="https://nielzosfilms.netlify.app/"
									color="secondary"
									target="blank"
								>
									Website
								</Link>
							</Box>
						</Grid>
					</Grid>
					<Typography variant="h5">Note Shortcuts</Typography>
					<Divider className={classes.divider} />
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Keys</TableCell>
									<TableCell>Action</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>
										<code>ctrl + s</code>
									</TableCell>
									<TableCell>Save</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<code>ctrl + p</code>
									</TableCell>
									<TableCell>Global search note</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<code>ctrl + alt + n</code>
									</TableCell>
									<TableCell>Create new note</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				</DialogContent>
				<DialogActions>
					<Button color="primary" onClick={handleClose}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
