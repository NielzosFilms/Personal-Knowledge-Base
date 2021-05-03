import React from "react";
import {useQuery, useMutation, gql} from "@apollo/client";
import {
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TableCell,
	TableRow,
	Paper,
	Button,
	IconButton,
	AppBar,
	Toolbar,
	Divider,
	Box,
	TextField,
	InputAdornment,
	Link,
} from "@material-ui/core";
import {
	Edit,
	Launch,
	DeleteOutline,
	AddBox,
	Add,
	Sync,
	GetApp,
	Close,
	Folder,
} from "@material-ui/icons";
import {getDateString} from "../../services/dateFunctions";
import {useHistory} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import ToolbarCustom from "../ToolbarCustom";
import {addNoteToHistory} from "../../services/noteHistory";
import {handleDownload} from "./downloadHandler";

// const NOTE_QUERY = gql`
// 	query Notes($search: String) {
// 		notes(search: $search) {
// 			id
// 			filename
// 			content
// 			createdAt
// 			updatedAt
// 		}
// 	}
// `;

const FOLDER_QUERY = gql`
	query Folder($id: Int) {
		folderByIdOrRoot(id: $id) {
			id
			name
			subFolders {
				id
				name
				ancestry
				createdAt
				updatedAt
			}
			notes {
				id
				filename
				createdAt
				updatedAt
			}
			createdAt
			updatedAt
		}
	}
`;

const NOTE_DELETE = gql`
	mutation Delete($id: Int!) {
		deleteNote(id: $id)
	}
`;

const useStyles = makeStyles((theme) => ({
	tableRow: {
		cursor: "pointer",
	},
	actionButton: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	deleteButton: {
		marginLeft: theme.spacing(2),
	},
	divider: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	folderIcon: {
		marginRight: theme.spacing(1),
	},
}));

export default function List() {
	const [search, setSearch] = React.useState("");
	const [folderId, setFolderId] = React.useState(null);
	const {loading, error, data, refetch} = useQuery(FOLDER_QUERY, {
		variables: {
			id: folderId,
		},
	});
	const [deleteNote, deleteNoteResult] = useMutation(NOTE_DELETE, {
		refetchQueries: [{query: FOLDER_QUERY}],
	});
	const [folders, setFolders] = React.useState([]);
	const [notes, setNotes] = React.useState([]);
	const history = useHistory();
	const classes = useStyles();

	React.useEffect(() => {
		if (data?.folderByIdOrRoot) {
			// console.log("setNotes LIST");
			console.log(data.folderByIdOrRoot);
			setNotes(data.folderByIdOrRoot.notes);
			setFolders(data.folderByIdOrRoot.subFolders);
		}
	}, [loading, search]);

	React.useEffect(() => {
		refetch();
	}, [search]);

	if (error) {
		return <>Error :(</>;
	}

	const handleEditClick = (id) => {
		addNoteToHistory(id);
		history.push(`/notes/edit/${id}`);
	};

	const handleDeleteClick = (id) => {
		deleteNote({
			variables: {
				id,
			},
		});
		refetch();
	};

	return (
		<>
			<ToolbarCustom>
				<TextField
					size="small"
					color="secondary"
					placeholder="Search..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					InputProps={{
						endAdornment: search && (
							<IconButton
								onClick={() => setSearch("")}
								size="small"
							>
								<Close />
							</IconButton>
						),
					}}
				/>
				<div style={{flexGrow: 1}}></div>
				<IconButton
					color="secondary"
					onClick={() => history.push("/notes/new")}
				>
					<AddBox />
				</IconButton>
				<IconButton color="secondary" onClick={() => refetch()}>
					<Sync />
				</IconButton>
			</ToolbarCustom>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Filename</TableCell>
							<TableCell align="right">Created at</TableCell>
							<TableCell align="right">Updated at</TableCell>
							<TableCell align="right">Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading && (
							<TableRow>
								<TableCell>
									<i>Loading...</i>
								</TableCell>
								<TableCell />
								<TableCell />
								<TableCell />
							</TableRow>
						)}
						{folderId && (
							<TableRow
								hover
								className={classes.tableRow}
								onClick={() => setFolderId(null)}
							>
								<TableCell component="th" scope="row">
									<Link>Back...</Link>
								</TableCell>
								<TableCell />
								<TableCell />
								<TableCell />
							</TableRow>
						)}
						{folders.map((folder) => (
							<TableRow
								key={folder.id}
								hover
								className={classes.tableRow}
								onClick={() => setFolderId(folder.id)}
							>
								<TableCell component="th" scope="row">
									<Box display="flex" justifyItems="center">
										<Folder
											className={classes.folderIcon}
										/>{" "}
										{folder.name}
									</Box>
								</TableCell>
								<TableCell align="right">
									{getDateString(folder.createdAt)}
								</TableCell>
								<TableCell align="right">
									{getDateString(folder.updatedAt)}
								</TableCell>
								<TableCell align="right"></TableCell>
							</TableRow>
						))}
						{notes.map((note) => (
							<TableRow
								key={note.id}
								hover
								className={classes.tableRow}
							>
								<TableCell
									component="th"
									scope="row"
									onClick={() => handleEditClick(note.id)}
								>
									{note.filename}
								</TableCell>
								<TableCell
									align="right"
									onClick={() => handleEditClick(note.id)}
								>
									{getDateString(note.createdAt)}
								</TableCell>
								<TableCell
									align="right"
									onClick={() => handleEditClick(note.id)}
								>
									{getDateString(note.updatedAt)}
								</TableCell>
								<TableCell align="right">
									<Box
										display="flex"
										justifyContent="flex-end"
									>
										<IconButton
											onClick={() =>
												handleEditClick(note.id)
											}
											color="secondary"
											className={classes.actionButton}
											size="small"
										>
											<Launch />
										</IconButton>
										<IconButton
											onClick={() =>
												handleDownload(
													note.content,
													note.filename
												)
											}
											color="secondary"
											className={classes.actionButton}
											size="small"
										>
											<GetApp />
										</IconButton>
										<IconButton
											onClick={() =>
												handleDeleteClick(note.id)
											}
											color="secondary"
											className={
												(classes.actionButton,
												classes.deleteButton)
											}
											size="small"
										>
											<DeleteOutline />
										</IconButton>
									</Box>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
