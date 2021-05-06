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
import {useHistory, useParams} from "react-router-dom";
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
	query Folder($ancestry: String!) {
		folderByAncestry(ancestry: $ancestry) {
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
	breadcrumbs: {
		marginBottom: theme.spacing(1),
		marginLeft: theme.spacing(1),
	},
	link: {
		cursor: "pointer",
	},
}));

export default function List() {
	const [search, setSearch] = React.useState("");
	const [ancestry, setAncestry] = React.useState("root/");
	const {loading, error, data, refetch} = useQuery(FOLDER_QUERY, {
		variables: {
			ancestry,
		},
	});
	const [deleteNote, deleteNoteResult] = useMutation(NOTE_DELETE, {
		refetchQueries: [{query: FOLDER_QUERY}],
	});
	const [folders, setFolders] = React.useState([]);
	const [notes, setNotes] = React.useState([]);
	const [crums, setCrums] = React.useState([]);
	const history = useHistory();
	const classes = useStyles();

	React.useEffect(() => {
		if (data?.folderByAncestry) {
			// console.log("setNotes LIST");
			console.log(data.folderByAncestry);
			setNotes(data.folderByAncestry.notes);
			setFolders(data.folderByAncestry.subFolders);
		}
	}, [loading, data]);

	React.useEffect(() => {
		refetch();
	}, [search, ancestry]);

	React.useEffect(() => {
		let tmp_crums = [];
		let tmp_ancestry = "";
		ancestry.split("/").map((crum, index) => {
			if (crum === "") return;
			tmp_ancestry = `${tmp_ancestry}${crum}/`;

			let new_crum = {};
			if (crum === "root") {
				new_crum = {title: "Notes", ancestry: tmp_ancestry};
			} else {
				const folder = folders.find(
					(folder) => folder.ancestry === tmp_ancestry
				);
				new_crum = {
					title: folder?.name || "NULL",
					ancestry: tmp_ancestry,
				};
			}
			if (crums[index] && crums[index].ancestry === tmp_ancestry) {
				tmp_crums.push(crums[index]);
			} else {
				tmp_crums.push(new_crum);
			}
		});
		setCrums(tmp_crums);
		console.log(tmp_crums);
	}, [ancestry]);

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
			<Breadcrumbs className={classes.breadcrumbs}>
				{crums.map((crum, index) => {
					if (index === crums.length - 1) {
						return <Typography>{crum.title}</Typography>;
					} else {
						return (
							<Link
								className={classes.link}
								onClick={() => setAncestry(crum.ancestry)}
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
						{/* <TableRow hover className={classes.tableRow}>
							<TableCell>
								<Link
									onClick={() => {
										setAncestry("root/");
										refetch();
									}}
								>
									Back...
								</Link>
							</TableCell>
							<TableCell />
							<TableCell />
							<TableCell />
						</TableRow> */}
						{folders.map((folder) => (
							<TableRow
								key={folder.id}
								hover
								className={classes.tableRow}
								onClick={() => setAncestry(folder.ancestry)}
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
