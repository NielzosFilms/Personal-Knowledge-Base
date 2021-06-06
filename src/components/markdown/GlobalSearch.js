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
} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import {useSnackbar} from "notistack";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	disabled: {
		color: theme.palette.action.disabled,
	},
}));

export default function GlobalSearch({data, refetch}) {
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState(null);
	const [open, setOpen] = useState(false);
	const {enqueueSnackbar} = useSnackbar();
	const classes = useStyles();
	const history = useHistory();

	useHotkeys(["Control+p", "Meta+p"], (e) => {
		e.preventDefault();
		setSearch("");
		refetch();
		setOpen(!open);
	});
	useHotkeys(["Enter"], (e) => {
		if (open) {
			e.preventDefault();
			openSelectedNote();
		}
	});

	const handleClose = () => {
		setSearch("");
		setOpen(false);
	};

	const onChange = (e, option, reason) => {
		setSelected(option);
	};

	const openSelectedNote = () => {
		if (selected) {
			history.push(`/notes/edit/${selected.id}`);
			handleClose();
		} else {
			enqueueSnackbar(`No note found with the name ${search}`, {
				variant: "warning",
			});
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} fullWidth>
			<DialogTitle>Search for note</DialogTitle>
			<DialogContent>
				<Autocomplete
					autoHighlight
					autoSelect
					options={data}
					fullWidth
					getOptionLabel={(option) => option.filename}
					getOptionSelected={(option, value) =>
						option.id === value.id
					}
					onHighlightChange={onChange}
					renderOption={(option, state) => {
						const ancestry = option.folder.ancestry
							.split("root/")
							.pop();
						return (
							<Box display="flex">
								<Typography className={classes.disabled}>
									{option.folder.ancestryResolved}
								</Typography>
								<Typography>{option.filename}</Typography>
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
				<Box width="100%" display="flex" justifyContent="space-between">
					<Button color="primary" onClick={handleClose}>
						Close
					</Button>
					<Button color="primary" onClick={openSelectedNote}>
						Open
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
}
