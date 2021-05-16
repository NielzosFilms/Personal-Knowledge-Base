import React from "react";
import {useQuery, useMutation, gql} from "@apollo/client";

import {
	Paper,
	Box,
	Typography,
	Divider,
	ButtonGroup,
	Button,
	Slide,
	Dialog,
	AppBar,
	IconButton,
	Toolbar,
	Container,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Switch,
} from "@material-ui/core";
import {Check, Close} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router-dom";
import {useSnackbar} from "notistack";

import ListRenderer from "./ListRenderer";
import {LIST_QUERY} from "./List";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const CREATE_GROCERY = gql`
	mutation CreateGrocery(
		$grocery_list_id: Int!
		$name: String!
		$needed: Boolean
	) {
		createGrocery(
			grocery_list_id: $grocery_list_id
			name: $name
			needed: $needed
		) {
			id
		}
	}
`;

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: "relative",
	},
	title: {
		flex: 1,
	},
	container: {
		marginTop: theme.spacing(10),
	},
	dialogActions: {
		display: "flex",
		justifyContent: "space-between",
	},
}));

export default function AddDialog({open, setOpen, items, refetch}) {
	const url_params = useParams();
	const REFETCH_QUERIES = {
		refetchQueries: [
			{
				query: LIST_QUERY,
				variables: {
					id: Number(url_params.id),
				},
			},
		],
	};
	const [createGrocery, createGroceryRes] = useMutation(
		CREATE_GROCERY,
		REFETCH_QUERIES
	);
	const [createOpen, setCreateOpen] = React.useState(false);
	const [name, setName] = React.useState("");
	const [needed, setNeeded] = React.useState(false);
	const classes = useStyles();
	const {enqueueSnackbar} = useSnackbar();

	const handleClose = () => {
		setOpen(false);
	};

	const handleCreate = () => {
		createGrocery({
			variables: {
				grocery_list_id: Number(url_params.id),
				name,
				needed,
			},
		});
		if (needed) {
			enqueueSnackbar(`${name} has been created and added to the list!`, {
				variant: "success",
			});
		} else {
			enqueueSnackbar(
				`${name} has been created and added to the archive!`,
				{
					variant: "success",
				}
			);
		}
		handleCreateClose();
	};

	const handleCreateClose = () => {
		setName("");
		setNeeded(false);
		setCreateOpen(false);
	};

	return (
		<>
			<Dialog open={createOpen} onClose={handleCreateClose}>
				<DialogTitle>Create grocery item</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						label="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						fullWidth
					/>
					<Box display="flex" alignItems="center">
						<Switch
							label="Add to list"
							checked={needed}
							onChange={(e) => setNeeded(e.target.checked)}
						/>
						<Typography>Add to list</Typography>
					</Box>
				</DialogContent>
				<DialogActions className={classes.dialogActions}>
					<Button
						variant="contained"
						color="primary"
						onClick={handleCreateClose}
					>
						Close
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleCreate}
					>
						Create
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<AppBar className={classes.AppBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Add item from archive
						</Typography>
						<IconButton onClick={handleClose}>
							<Close />
						</IconButton>
					</Toolbar>
				</AppBar>
				{/* <Container className={classes.container}> */}
				<div className={classes.container}>
					<ListRenderer
						title="Archived items"
						items={items}
						variant="archive"
						refetch={refetch}
						setCreateOpen={setCreateOpen}
					/>
				</div>
				{/* </Container> */}
			</Dialog>
		</>
	);
}
