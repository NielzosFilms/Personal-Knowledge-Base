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
} from "@material-ui/core";
import {ArrowBack, DeleteOutline, SaveOutlined} from "@material-ui/icons";

import ToolbarCustom from "../ToolbarCustom";
import {getDateString} from "../../services/dateFunctions";
import useHotkeys from "@reecelucas/react-use-hotkeys";

const QUERY_USER = gql`
	query UserById($id: Int!) {
		userById(id: $id) {
			id
			name
			email
			admin
			createdAt
			updatedAt
		}
	}
`;

const UPDATE_USER = gql`
	mutation UpdateUser(
		$id: Int!
		$name: String
		$email: String
		$admin: Boolean
	) {
		updateUser(id: $id, name: $name, email: $email, admin: $admin) {
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
	const {loading, error, data} = useQuery(QUERY_USER, {
		variables: {
			id: Number(id),
		},
	});
	const [updateUser, updateUserRes] = useMutation(UPDATE_USER, {
		refetchQueries: [
			{
				query: QUERY_USER,
				variables: {
					id: Number(id),
				},
			},
		],
	});
	const [user, setUser] = React.useState({});
	const classes = useStyles();
	const history = useHistory();

	useHotkeys(["Control+s", "Meta+s"], (e) => {
		e.preventDefault();
		handleSave();
	});

	React.useEffect(() => {
		if (data?.userById) {
			setUser(data.userById);
		}
	}, [data]);

	const handleSave = () => {
		if (data.userById !== user) {
			updateUser({
				variables: {
					...user,
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
							onClick={() => history.push("/admin/users")}
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
					Created at: {getDateString(data.userById.createdAt)}
				</Typography>
				<Typography variant="body2" className={classes.info}>
					Updated at: {getDateString(data.userById.updatedAt)}
				</Typography>
				{user !== data.userById && (
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
									label="Username"
									value={user.name}
									onChange={(e) =>
										setUser({...user, name: e.target.value})
									}
									required
									className={classes.field}
								/>
								<TextField
									variant="filled"
									label="Email"
									value={user.email}
									onChange={(e) =>
										setUser({
											...user,
											email: e.target.value,
										})
									}
									required
									className={classes.field}
								/>
							</Grid>
							<Grid item xs={6}>
								<Box display="flex" alignItems="center">
									<Switch
										color="primary"
										disabled={
											Number(authenticatedUser.id) ===
											Number(id)
										}
										checked={user.admin || false}
										onChange={(e) => {
											setUser({
												...user,
												admin: e.target.checked,
											});
										}}
									/>
									<Typography>Is admin</Typography>
								</Box>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		</>
	);
}
