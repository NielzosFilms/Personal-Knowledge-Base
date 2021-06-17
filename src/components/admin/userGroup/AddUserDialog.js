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
} from "@material-ui/core";
import {SearchOutlined, Folder} from "@material-ui/icons";
import {useMutation, gql} from "@apollo/client";
import {Autocomplete} from "@material-ui/lab";
import {useSnackbar} from "notistack";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";

const ADD_USER_MUT = gql`
	mutation AddUser($userId: Int!, $userGroupId: Int!) {
		addUserToUserGroup(userId: $userId, userGroupId: $userGroupId)
	}
`;

const useStyles = makeStyles((theme) => ({
	disabled: {
		color: theme.palette.action.disabled,
	},
	searchButton: {
		position: "fixed",
		zIndex: 1,
		bottom: 20,
		right: 20,
	},
	folderIcon: {
		marginRight: theme.spacing(1),
	},
}));

export default function AddUserDialog({
	userGroupId,
	open,
	setOpen,
	users,
	refetch,
}) {
	const [addUser, addUserResult] = useMutation(ADD_USER_MUT);
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState(null);
	const {enqueueSnackbar} = useSnackbar();
	const classes = useStyles();
	const history = useHistory();

	useHotkeys(["Enter"], (e) => {
		if (open) {
			e.preventDefault();
			addSelectedUser();
		}
	});

	const handleOpen = () => {
		setSearch("");
		users.refetch();
		setOpen(!open);
	};

	const handleClose = () => {
		setSearch("");
		setOpen(false);
	};

	const onChange = (e, option, reason) => {
		setSelected(option);
	};

	const addSelectedUser = () => {
		if (selected) {
			addUser({
				variables: {
					userId: selected.id,
					userGroupId,
				},
			});
			enqueueSnackbar("Added user to the user group", {
				variant: "info",
			});
			refetch();
			handleClose();
		} else {
			enqueueSnackbar(`No user found with the name ${search}`, {
				variant: "warning",
			});
		}
	};

	return (
		<>
			<Dialog open={open} onClose={handleClose} fullWidth>
				<DialogTitle>Add user to group</DialogTitle>
				<DialogContent>
					<Autocomplete
						autoHighlight
						autoSelect
						options={users.data.users.filter((user) => {
							let found = false;
							user.userGroups.forEach((userGroup) => {
								if (userGroup.id === userGroupId) found = true;
							});
							return !found;
						})}
						fullWidth
						getOptionLabel={(option) => option.name}
						getOptionSelected={(option, value) =>
							option.id === value.id
						}
						onHighlightChange={onChange}
						renderOption={(option, state) => {
							return (
								<Box display="flex">
									<Typography>{option.name}</Typography>
								</Box>
							);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Search"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								fullWidth
								autoFocus
							/>
						)}
					/>
				</DialogContent>
				<DialogActions>
					<Box
						width="100%"
						display="flex"
						justifyContent="space-between"
					>
						<Button color="primary" onClick={handleClose}>
							Cancel
						</Button>
						<Button color="primary" onClick={addSelectedUser}>
							Add
						</Button>
					</Box>
				</DialogActions>
			</Dialog>
			<Tooltip title="Global search (ctrl+p)">
				<Button
					variant="contained"
					color="primary"
					onClick={handleOpen}
					className={classes.searchButton}
				>
					<SearchOutlined />
				</Button>
			</Tooltip>
		</>
	);
}
