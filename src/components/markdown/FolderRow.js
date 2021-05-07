import React from "react";
import {
	TableRow,
	TableCell,
	TextField,
	Box,
	IconButton,
} from "@material-ui/core";
import {Folder, Close, EditOutlined, DeleteOutline} from "@material-ui/icons";

const FolderRow = ({folder, setFolderId}) => {
	const [name, setName] = React.useState(folder.name);
	const [edit, setEdit] = React.useState(false);
	return (
		<TableRow key={folder.id} hover className={classes.tableRow}>
			<TableCell component="th" scope="row">
				<Box display="flex" justifyItems="center">
					<Folder className={classes.folderIcon} />{" "}
					{edit ? (
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
					) : (
						folder.name
					)}
				</Box>
			</TableCell>
			<TableCell align="right" onClick={() => setFolderId(folder.id)}>
				{getDateString(folder.createdAt)}
			</TableCell>
			<TableCell align="right" onClick={() => setFolderId(folder.id)}>
				{getDateString(folder.updatedAt)}
			</TableCell>
			<TableCell align="right">
				<Box display="flex" justifyContent="flex-end">
					<IconButton
						color="secondary"
						className={classes.actionButton}
						size="small"
						onClick={() => setEdit(true)}
					>
						<EditOutlined />
					</IconButton>
					<IconButton
						onClick={() => {
							// handleFolderDeleteClick(note.id)
						}}
						color="secondary"
						className={(classes.actionButton, classes.deleteButton)}
						size="small"
					>
						<DeleteOutline />
					</IconButton>
				</Box>
			</TableCell>
		</TableRow>
	);
};

export default FolderRow;
