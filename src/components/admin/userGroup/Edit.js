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
} from "@material-ui/core";
import {
	ArrowBack,
	DeleteOutline,
	SaveOutlined,
	EditOutlined,
} from "@material-ui/icons";

import ToolbarCustom from "../../ToolbarCustom";
import {getDateString} from "../../../services/dateFunctions";
import useHotkeys from "@reecelucas/react-use-hotkeys";

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
}));

export default function EditUser({authenticatedUser}) {
	const {id} = useParams();
	const {loading, error, data} = useQuery(QUERY_GROUP, {
		variables: {
			id: Number(id),
		},
	});
	const [updateGroup, updateGroupRes] = useMutation(UPDATE_GROUP, {
		refetchQueries: [
			{
				query: QUERY_GROUP,
				variables: {
					id: Number(id),
				},
			},
		],
	});
	const [group, setGroup] = React.useState({});
	const classes = useStyles();
	const history = useHistory();

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
					...group,
				},
			});
		}
	};

	if (loading) return <>Loading...</>;
	if (error) return <>Error :(</>;
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
									{group?.groceryLists?.map((list) => (
										<TableRow key={list.id} hover>
											<TableCell>{list.name}</TableCell>
											<TableCell align="right">
												{getDateString(list.createdAt)}
											</TableCell>
											<TableCell align="right">
												{getDateString(list.updatedAt)}
											</TableCell>
											<TableCell align="right">
												<Box
													display="flex"
													justifyContent="flex-end"
												>
													<IconButton
														// onClick={() =>
														// 	redirect(
														// 		`/admin/userGroups/edit/${group.id}`
														// 	)
														// }
														color="secondary"
														size="small"
													>
														<EditOutlined />
													</IconButton>
												</Box>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Grid>
			</Grid>
		</>
	);
}
