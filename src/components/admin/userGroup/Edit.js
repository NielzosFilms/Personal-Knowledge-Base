import React from "react";
import {useQuery, gql, useMutation} from "@apollo/client";
import {useParams, useHistory} from "react-router-dom";

import {makeStyles, useTheme} from "@material-ui/core/styles";
import {
	Box,
	Typography,
	Divider,
	IconButton,
	Grid,
	Paper,
	TextField,
	Switch,
	FormControlLabel,
	TableContainer,
	Table,
	TableCell,
	TableBody,
	TableHead,
	TableRow,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	Button,
} from "@material-ui/core";
import {
	ArrowBack,
	DeleteOutline,
	SaveOutlined,
	EditOutlined,
	Add,
	DeleteOutlined,
} from "@material-ui/icons";

import ToolbarCustom from "../../ToolbarCustom";
import {getDateString} from "../../../services/dateFunctions";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import {useSnackbar} from "notistack";

const QUERY_GROUP = gql`
	query UserGroupById($id: Int!) {
		userGroupById(id: $id) {
			id
			name
			groceryLists {
				id
				name
				createdAt
				updatedAt
			}
			createdAt
			updatedAt
		}
	}
`;

const UPDATE_GROUP = gql`
	mutation UpdateGroup($id: Int!, $name: String!) {
		updateUserGroup(id: $id, name: $name) {
			id
		}
	}
`;

const CREATE_LIST = gql`
	mutation CreateList($name: String!, $user_group_id: Int!) {
		createGroceryList(name: $name, user_group_id: $user_group_id) {
			id
		}
	}
`;

const DELETE_LIST = gql`
	mutation DeleteList($id: Int!) {
		deleteGroceryList(id: $id)
	}
`;

const UPDATE_LIST = gql`
	mutation UpdateList($id: Int!, $name: String!) {
		updateGroceryList(id: $id, name: $name) {
			id
		}
	}
`;

const useStyles = makeStyles((theme) => ({
	divider: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	info: {
		marginTop: theme.spacing(1),
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		opacity: 0.5,
	},
	width100: {
		width: "100%",
	},
	paper: {
		padding: theme.spacing(1),
	},
	field: {
		margin: theme.spacing(1),
	},
	actions: {
		display: "flex",
		justifyContent: "space-between",
	},
}));

export default function EditUser({authenticatedUser}) {
	const {id} = useParams();
	const {loading, error, data, refetch} = useQuery(QUERY_GROUP, {
		variables: {
			id: Number(id),
		},
	});
	const [updateGroup, updateGroupRes] = useMutation(UPDATE_GROUP);
	const [createListMut, createListMutRes] = useMutation(CREATE_LIST);
	const [deleteListMut, deleteListMutRes] = useMutation(DELETE_LIST);
	const [updateListMut, updateListMutRes] = useMutation(UPDATE_LIST);
	const [group, setGroup] = React.useState({});
	const [createList, setCreateList] = React.useState(false);
	const [editList, setEditList] = React.useState(false);
	const [name, setName] = React.useState("");
	const [listId, setListId] = React.useState(null);
	const classes = useStyles();
	const history = useHistory();
	const {enqueueSnackbar} = useSnackbar();

	useHotkeys(["Control+s", "Meta+s"], (e) => {
		e.preventDefault();
		handleSave();
	});

	React.useEffect(() => {
		if (data?.userGroupById) {
			setGroup(data.userGroupById);
		}
	}, [data]);

	const handleSave = () => {
		if (data.userGroupById !== group) {
			updateGroup({
				variables: {
					id: group.id,
					name: group.name,
				},
			});
			enqueueSnackbar("Saved!", {variant: "success"});
			refetch();
		}
	};

	const handleClose = () => {
		setCreateList(false);
		setEditList(false);
		setName("");
		setListId(null);
	};

	const handleListCreate = () => {
		if (name) {
			createListMut({
				variables: {
					name,
					user_group_id: group.id,
				},
			});
			enqueueSnackbar("Grocery list created!", {variant: "success"});
			handleClose();
			refetch();
		} else {
			enqueueSnackbar("The grocery list name is empty!", {
				variant: "warning",
			});
		}
	};

	const handleDelete = (id, name) => {
		if (
			window.confirm(
				`Are you sure you want to remove "${name}" grocery list and all its groceries?`
			)
		) {
			deleteListMut({
				variables: {
					id,
				},
			});
			enqueueSnackbar(`The grocery list "${name}" has been deleted.`, {
				variant: "info",
			});
			refetch();
		}
	};

	const handleListUpdate = () => {
		updateListMut({
			variables: {
				id: Number(listId),
				name,
			},
		});
		enqueueSnackbar("Saved!", {
			variant: "success",
		});
		refetch();
		handleClose();
	};

	const handleListEditOpen = (id, name) => {
		setListId(id);
		setName(name);
		setEditList(true);
	};

	if (loading) return <>Loading...</>;
	if (error) return <>Error :(</>;
	if (!data.userGroupById) return <></>;
	return (
		<>
			<ToolbarCustom divider={false}>
				<Box
					display="flex"
					justifyContent="space-between"
					className={classes.width100}
				>
					<Box display="flex" alignItems="center">
						<IconButton
							color="secondary"
							onClick={() => history.push("/admin/userGroups")}
						>
							<ArrowBack />
						</IconButton>
					</Box>
					<Box display="flex" alignItems="center">
						<IconButton color="secondary" onClick={handleSave}>
							<SaveOutlined />
						</IconButton>
					</Box>
				</Box>
			</ToolbarCustom>
			<Box display="flex" justifyContent="start">
				<Typography variant="body2" className={classes.info}>
					Created at: {getDateString(data.userGroupById.createdAt)}
				</Typography>
				<Typography variant="body2" className={classes.info}>
					Updated at: {getDateString(data.userGroupById.updatedAt)}
				</Typography>
				{group !== data.userGroupById && (
					<Typography variant="body2" className={classes.info}>
						*You have unsaved changes*
					</Typography>
				)}
			</Box>
			<Divider className={classes.divider} />
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<Typography variant="h4">Info</Typography>
					<Paper className={classes.paper}>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<TextField
									variant="filled"
									label="Name"
									value={group.name}
									onChange={(e) =>
										setGroup({
											...group,
											name: e.target.value,
										})
									}
									required
									className={classes.field}
								/>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography variant="h4">Grocery Lists</Typography>
					<Paper className={classes.paper}>
						<TableContainer>
							<Table>
								<TableHead>
									<TableCell>Name</TableCell>
									<TableCell align="right">
										Created at
									</TableCell>
									<TableCell align="right">
										Updated at
									</TableCell>
									<TableCell align="right">Actions</TableCell>
								</TableHead>
								<TableBody>
									{group?.groceryLists?.map((list, index) => (
										<TableRow key={index} hover>
											<TableCell>{list.name}</TableCell>
											<TableCell align="right">
												{list.createdAt
													? getDateString(
															list.createdAt
													  )
													: "Just now"}
											</TableCell>
											<TableCell align="right">
												{list.updatedAt
													? getDateString(
															list.updatedAt
													  )
													: "Just now"}
											</TableCell>
											<TableCell align="right">
												{list.id && (
													<Box
														display="flex"
														justifyContent="flex-end"
													>
														<IconButton
															onClick={() =>
																handleListEditOpen(
																	list.id,
																	list.name
																)
															}
															color="secondary"
															size="small"
														>
															<EditOutlined />
														</IconButton>
														<IconButton
															onClick={() =>
																handleDelete(
																	list.id,
																	list.name
																)
															}
															color="secondary"
															size="small"
														>
															<DeleteOutlined />
														</IconButton>
													</Box>
												)}
											</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell></TableCell>
										<TableCell></TableCell>
										<TableCell></TableCell>
										<TableCell align="right">
											<IconButton
												onClick={() =>
													setCreateList(true)
												}
												color="secondary"
												size="small"
											>
												<Add />
											</IconButton>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Grid>
			</Grid>
			<Dialog open={createList}>
				<DialogTitle>Create grocery list</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						label="List name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						fullWidth
					/>
				</DialogContent>
				<DialogActions className={classes.actions}>
					<Button
						variant="contained"
						color="primary"
						onClick={handleClose}
					>
						Close
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleListCreate}
					>
						Create
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={editList}>
				<DialogTitle>Edit grocery list</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						label="List name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						fullWidth
					/>
				</DialogContent>
				<DialogActions className={classes.actions}>
					<Button
						variant="contained"
						color="primary"
						onClick={handleClose}
					>
						Close
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleListUpdate}
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
