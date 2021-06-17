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
import {Autocomplete} from "@material-ui/lab";
import {useSnackbar} from "notistack";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";

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

export default function GlobalSearch({notes, folders}) {
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState(null);
	const [open, setOpen] = useState(false);
	const {enqueueSnackbar} = useSnackbar();
	const classes = useStyles();
	const history = useHistory();

	useHotkeys(["Control+p", "Meta+p"], (e) => {
		e.preventDefault();
		handleOpen();
	});
	useHotkeys(["Control+Alt+n", "Meta+Alt+n"], (e) => {
		e.preventDefault();
		history.push("/notes/new");
	});
	useHotkeys(["Enter"], (e) => {
		if (open) {
			e.preventDefault();
			openSelectedNote();
		}
	});

	const handleOpen = () => {
		setSearch("");
		notes.refetch();
		setOpen(!open);
	};

	const handleClose = () => {
		setSearch("");
		setOpen(false);
	};

	const onChange = (e, option, reason) => {
		setSelected(option);
	};

	const openSelectedNote = () => {
		if (selected) {
			if (selected.__typename === "Note") {
				history.push(`/notes/edit/${selected.id}`);
				handleClose();
			} else {
				// localStorage.removeItem("breadCrums");
				// localStorage.setItem("folderId", selected.id);
				// console.log(`${selected.ancestryResolved}${selected.name}`);
				// console.log(`${selected.ancestry}${selected.id}`);
				enqueueSnackbar("This function does not work yet!", {
					variant: "info",
				});
				handleClose();
			}
		} else {
			enqueueSnackbar(`No note/folder found with the name ${search}`, {
				variant: "warning",
			});
		}
	};

	return (
		<>
			<Dialog open={open} onClose={handleClose} fullWidth>
				<DialogTitle>Search for note</DialogTitle>
				<DialogContent>
					<Autocomplete
						autoHighlight
						autoSelect
						options={[...notes.data.notes, ...folders.data.folders]}
						fullWidth
						getOptionLabel={(option) =>
							option.__typename === "Note"
								? option.filename
								: option.name
						}
						getOptionSelected={(option, value) =>
							option.id === value.id
						}
						onHighlightChange={onChange}
						renderOption={(option, state) => {
							if (option.__typename === "Note") {
								return (
									<Box display="flex">
										<Typography
											className={classes.disabled}
										>
											{option.folder.ancestryResolved}
										</Typography>
										<Typography>
											{option.filename}
										</Typography>
									</Box>
								);
							} else {
								let ancestry =
									option.ancestryResolved.split("/");
								ancestry.pop();
								ancestry.pop();
								ancestry = ancestry.join("/");
								return (
									<Box display="flex">
										<Folder
											className={[
												classes.disabled,
												classes.folderIcon,
											]}
										/>
										<Typography
											className={classes.disabled}
										>
											{ancestry}/
										</Typography>
										<Typography>{option.name}</Typography>
										<Typography
											className={classes.disabled}
										>
											/
										</Typography>
									</Box>
								);
							}
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
							Close
						</Button>
						<Button color="primary" onClick={openSelectedNote}>
							Open
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
