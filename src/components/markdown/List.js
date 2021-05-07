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
	Breadcrumbs,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@material-ui/core";
import {
	Edit,
	Launch,
	DeleteOutline,
	NoteAddOutlined,
	Refresh,
	GetAppOutlined,
	Close,
	Folder,
	CreateNewFolderOutlined,
	EditOutlined,
	SaveOutlined,
} from "@material-ui/icons";
import {getDateString} from "../../services/dateFunctions";
import {useHistory, useParams} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import ToolbarCustom from "../ToolbarCustom";
import {addNoteToHistory} from "../../services/noteHistory";
import {handleDownload} from "./downloadHandler";
import useHotkeys from "@reecelucas/react-use-hotkeys";

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
			ancestry
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

const CREATE_FOLDER = gql`
	mutation CreateFolder($ancestry: String!, $name: String!) {
		createFolder(ancestry: $ancestry, name: $name) {
			id
			name
			ancestry
		}
	}
`;

const UPDATE_FOLDER = gql`
	mutation UpdateFolder($id: Int!, $ancestry: String, $name: String) {
		updateFolder(id: $id, ancestry: $ancestry, name: $name) {
			id
			name
			ancestry
		}
	}
`;

const DELETE_FOLDER = gql`
	mutation DeleteFolder($id: Int!) {
		deleteFolder(id: $id)
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
	breadcrumbs: {
		marginBottom: theme.spacing(1),
		marginLeft: theme.spacing(1),
	},
	link: {
		cursor: "pointer",
	},
	folderActions: {
		display: "flex",
		justifyContent: "space-between",
	},
}));

export default function List() {
	const [search, setSearch] = React.useState("");
	const [ancestry, setAncestry] = React.useState("");
	const [crums, setCrums] = React.useState(
		JSON.parse(localStorage.getItem("breadCrums")) || []
	);
	const [folderId, setFolderId] = React.useState(
		crums[crums.length - 1]?.id || null
	);
	const {loading, error, data, refetch} = useQuery(FOLDER_QUERY, {
		variables: {
			id: Number(folderId),
		},
	});
	const [deleteNote, deleteNoteResult] = useMutation(NOTE_DELETE);
	const [createFolder, createFolderRes] = useMutation(CREATE_FOLDER);

	const [folders, setFolders] = React.useState([]);
	const [notes, setNotes] = React.useState([]);
	const [addFolderOpen, setAddFolderOpen] = React.useState(false);
	const [folderName, setFolderName] = React.useState("");
	const history = useHistory();
	const classes = useStyles();

	React.useEffect(() => {
		if (data?.folderByIdOrRoot) {
			// console.log("setNotes LIST");
			// console.log(data.folderByIdOrRoot);
			setNotes(data.folderByIdOrRoot.notes);
			setFolders(data.folderByIdOrRoot.subFolders);
			setAncestry(data.folderByIdOrRoot.ancestry);
			setFolderId(data.folderByIdOrRoot.id);

			let tmp_crums = [];
			crums.map((crum) => {
				if (crum.id !== folderId) {
					tmp_crums.push(crum);
				}
			});
			if (folderId) {
				localStorage.setItem("folderId", folderId);
				tmp_crums.push({
					title: data.folderByIdOrRoot.name,
					ancestry: data.folderByIdOrRoot.ancestry,
					id: folderId,
				});
			}
			localStorage.setItem("breadCrums", JSON.stringify(tmp_crums));
			setCrums(tmp_crums);
		}
	}, [loading, data]);

	React.useEffect(() => {
		refetch();
	}, [search, folderId, createFolderRes.loading]);

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

	const handleCrumClick = (crum, index) => {
		let tmp_crums = crums;
		tmp_crums.splice(index);
		setCrums(tmp_crums);
		setFolderId(crum.id);
	};

	const handleFolderCreateOpen = () => {
		setFolderName("");
		setAddFolderOpen(true);
	};

	const handleFolderCreate = () => {
		createFolder({
			variables: {
				ancestry: `${ancestry}${folderId}/`,
				name: folderName,
			},
		});
		setAddFolderOpen(false);
	};

	const FolderRow = ({folder, setFolderId, refetch}) => {
		const [updateFolder, updateFolderRes] = useMutation(UPDATE_FOLDER);
		const [deleteFolder, deleteFolderRes] = useMutation(DELETE_FOLDER, {
			refetchQueries: [{query: FOLDER_QUERY}],
		});
		const [name, setName] = React.useState(folder.name);
		const [edit, setEdit] = React.useState(false);

		const handleClose = () => {
			setEdit(false);
		};

		const handleOpen = () => {
			setEdit(true);
			setName(folder.name);
		};

		const handleSave = (e) => {
			e.preventDefault();
			updateFolder({
				variables: {
					id: folder.id,
					name,
				},
			});
			handleClose();
		};

		const handleDelete = () => {
			if (
				window.confirm(
					`Are you sure you want to delete the folder named "${folder.name}"?\nThis will also remove all of the notes inside of this folder.`
				)
			) {
				deleteFolder({
					variables: {
						id: folder.id,
					},
				});
			}
		};

		return (
			<>
				<Dialog open={edit}>
					<DialogTitle>Edit folder</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							label="Folder name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							fullWidth
						/>
					</DialogContent>
					<DialogActions className={classes.folderActions}>
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
							onClick={handleSave}
						>
							Save
						</Button>
					</DialogActions>
				</Dialog>
				<TableRow key={folder.id} hover className={classes.tableRow}>
					<TableCell component="th" scope="row">
						<Box
							display="flex"
							justifyItems="center"
							{...(!edit && {
								onClick: () => setFolderId(folder.id),
							})}
						>
							<Folder className={classes.folderIcon} />{" "}
							{folder.name}
						</Box>
					</TableCell>
					<TableCell
						align="right"
						onClick={() => setFolderId(folder.id)}
					>
						{getDateString(folder.createdAt)}
					</TableCell>
					<TableCell
						align="right"
						onClick={() => setFolderId(folder.id)}
					>
						{getDateString(folder.updatedAt)}
					</TableCell>
					<TableCell align="right">
						<Box display="flex" justifyContent="flex-end">
							<IconButton
								color="secondary"
								className={classes.actionButton}
								size="small"
								onClick={handleOpen}
							>
								<EditOutlined />
							</IconButton>
							<IconButton
								onClick={handleDelete}
								color="secondary"
								className={
									(classes.actionButton, classes.deleteButton)
								}
								size="small"
							>
								<DeleteOutline />
							</IconButton>
						</Box>
					</TableCell>
				</TableRow>
			</>
		);
	};

	return (
		<>
			<Dialog open={addFolderOpen}>
				<DialogTitle>Create folder</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						label="Folder name"
						value={folderName}
						onChange={(e) => setFolderName(e.target.value)}
						fullWidth
					/>
				</DialogContent>
				<DialogActions className={classes.folderActions}>
					<Button
						variant="contained"
						color="primary"
						onClick={() => setAddFolderOpen(false)}
					>
						Close
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleFolderCreate}
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>
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
					<NoteAddOutlined />
				</IconButton>
				<IconButton color="secondary" onClick={handleFolderCreateOpen}>
					<CreateNewFolderOutlined />
				</IconButton>
				<IconButton color="secondary" onClick={() => refetch()}>
					<Refresh />
				</IconButton>
			</ToolbarCustom>
			<Breadcrumbs className={classes.breadcrumbs}>
				{crums.map((crum, index) => {
					if (index === crums.length - 1) {
						return <Typography>{crum.title}</Typography>;
					} else {
						return (
							<Link
								className={classes.link}
								onClick={() => handleCrumClick(crum, index)}
							>
								{crum.title}
							</Link>
						);
					}
				})}
			</Breadcrumbs>
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
						{folders.map((folder) => (
							<FolderRow
								folder={folder}
								setFolderId={setFolderId}
								refetch={refetch}
							/>
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
											<GetAppOutlined />
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
