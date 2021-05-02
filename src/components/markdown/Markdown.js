import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import {
	TextField,
	IconButton,
	Toolbar,
	Divider,
	AppBar,
	Grid,
	Typography,
	Box,
	Menu,
	MenuItem,
	Button,
	Paper,
	TableContainer,
	Table,
	TableRow,
	TableHead,
	TableCell,
	Link as Linkurl,
} from "@material-ui/core";
import {
	Edit,
	Close,
	Save,
	GetApp,
	ArrowBack,
	Add,
	Link,
	Toc,
	Remove,
	Code,
	InsertPhoto,
	FormatListBulleted,
	FormatListNumbered,
} from "@material-ui/icons";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import {useQuery, useMutation, gql} from "@apollo/client";
import {useHistory, useParams, Prompt} from "react-router-dom";
import {getDateString} from "../../services/dateFunctions";
import ToolbarCustom from "../ToolbarCustom";
import {addNoteToHistory} from "../../services/noteHistory";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import {handleDownload} from "./downloadHandler";
import rehypeRaw from "rehype-raw";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {
	materialDark,
	materialLight,
	materialOceanic,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const NOTE_QUERY = gql`
	query Note($id: Int!) {
		noteById(id: $id) {
			filename
			content
			createdAt
			updatedAt
		}
	}
`;

const NOTE_CREATE = gql`
	mutation CreateNote($filename: String!, $content: String) {
		createNote(filename: $filename, content: $content) {
			id
		}
	}
`;

const NOTE_UPDATE = gql`
	mutation UpdateNote($id: Int!, $filename: String, $content: String) {
		updateNote(id: $id, filename: $filename, content: $content) {
			id
		}
	}
`;

const useStyles = makeStyles((theme) => ({
	divider: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	grow: {
		flexGrow: 1,
	},
	filenameText: {
		marginRight: theme.spacing(4),
	},
	info: {
		marginTop: theme.spacing(1),
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		opacity: 0.5,
	},
	codeBlock: {
		backgroundColor: "transparent",
	},
	inlineCode: {
		backgroundColor: theme.palette.background.paper,
		padding: 3,
		borderRadius: 5,
	},
	tableRow: {
		"&:nth-of-type(even)": {
			backgroundColor: theme.palette.action.hover,
		},
	},
	markdown: {
		"& h1,h2": {
			borderBottom: `1px solid ${theme.palette.background.paper}`,
		},
	},
}));

export default function MarkdownNew({isNew = false}) {
	const {id} = useParams();
	const noteResult = useQuery(NOTE_QUERY, {
		variables: {
			id: Number(id || 0),
		},
	});
	const [createNote, createNoteResult] = useMutation(NOTE_CREATE);
	const [updateNote, updateNoteResult] = useMutation(NOTE_UPDATE, {
		refetchQueries: [
			{
				query: NOTE_QUERY,
				variables: {
					id: Number(id || 0),
				},
			},
		],
	});
	const classes = useStyles();
	const theme = useTheme();
	const [text, setText] = React.useState("");
	const [filename, setFilename] = React.useState("");
	const [savedText, setSavedText] = React.useState("");
	const [savedFilename, setSavedFilename] = React.useState("");
	const [edit, setEdit] = React.useState(isNew);
	const [cursor, setCursor] = React.useState(0);
	const [insertOpen, setInsertOpen] = React.useState(false);
	const history = useHistory();

	React.useEffect(() => {
		if (noteResult.data?.noteById && !isNew) {
			setText(noteResult.data.noteById.content);
			setSavedText(noteResult.data.noteById.content);

			setFilename(noteResult.data.noteById.filename);
			setSavedFilename(noteResult.data.noteById.filename);
		}
	}, [noteResult.loading]);

	useHotkeys(["Control+s", "Meta+s"], (e) => {
		e.preventDefault();
		handleSave();
	});
	useHotkeys(["tab"], (e) => {
		e.preventDefault();
		handleTextInsert("\t");
	});

	const handleSave = async () => {
		if (filename !== savedFilename || text !== savedText) {
			if (isNew) {
				createNote({
					variables: {
						filename,
						content: text,
					},
				});
				setSavedFilename(filename);
				setSavedText(text);
			} else {
				updateNote({
					variables: {
						id: Number(id),
						filename,
						content: text,
					},
				});
				setSavedFilename(filename);
				setSavedText(text);
			}
		}
	};

	React.useEffect(() => {
		if (createNoteResult.data?.createNote) {
			addNoteToHistory(createNoteResult.data.createNote.id);
			history.push(`/notes/edit/${createNoteResult.data.createNote.id}`);
		}
	}, [createNoteResult.loading]);

	React.useEffect(() => {
		if (text !== savedText || filename !== savedFilename) {
			window.onbeforeunload = () => true;
		} else {
			window.onbeforeunload = undefined;
		}
	}, [text, savedText, filename, savedFilename]);

	const handleClose = () => {
		setEdit(false);
	};

	const handleTextInsert = (textInsert) => {
		setText(
			text.substring(0, cursor.start) +
				textInsert +
				text.substring(cursor.end)
		);
		setCursor({
			start: cursor.start + textInsert.length,
			end: cursor.start + textInsert.length,
		});
		setInsertOpen(null);
	};

	const toolbarButtons = () => {
		return (
			<>
				<Box
					display="flex"
					alignItems="center"
					className={classes.grow}
				>
					<IconButton
						color="secondary"
						onClick={() => history.push("/notes")}
					>
						<ArrowBack />
					</IconButton>
					{edit ? (
						<TextField
							label="Filename"
							size="small"
							color="secondary"
							required
							value={filename}
							onChange={(e) => setFilename(e.target.value)}
						/>
					) : (
						<Typography
							className={classes.filenameText}
							variant="h6"
						>
							{filename}
						</Typography>
					)}
					<IconButton color="secondary" onClick={handleSave}>
						<Save />
					</IconButton>
					<IconButton
						color="secondary"
						onClick={() => handleDownload(text, filename)}
					>
						<GetApp />
					</IconButton>
					{edit && (
						<>
							<Button
								color="secondary"
								onClick={(e) => setInsertOpen(e.currentTarget)}
							>
								Insert
							</Button>
							<Menu
								anchorEl={insertOpen}
								keepMounted
								open={Boolean(insertOpen)}
								onClose={() => setInsertOpen(null)}
							>
								<MenuItem
									onClick={() =>
										handleTextInsert("[TEXT](URL)\n")
									}
								>
									<Link /> Link/Url
								</MenuItem>
								<MenuItem
									onClick={() =>
										handleTextInsert(
											"| NAME | NAME |\n| --- | --- |\n| VALUE | VALUE |\n"
										)
									}
								>
									<Toc /> Table
								</MenuItem>
								<MenuItem
									onClick={() =>
										handleTextInsert(
											"- ITEM\n- ITEM\n- ITEM\n"
										)
									}
								>
									<FormatListBulleted /> Unordered list
								</MenuItem>
								<MenuItem
									onClick={() =>
										handleTextInsert(
											"1. ITEM\n1. ITEM\n1. ITEM\n"
										)
									}
								>
									<FormatListNumbered /> Ordered list
								</MenuItem>
								<MenuItem
									onClick={() => handleTextInsert("---\n")}
								>
									<Remove /> Divider
								</MenuItem>
								<MenuItem
									onClick={() =>
										handleTextInsert(
											"```LANGUAGE\nCODE\n```\n"
										)
									}
								>
									<Code /> Codeblock
								</MenuItem>
								<MenuItem
									onClick={() =>
										alert("Not a function yet :(")
									}
								>
									<InsertPhoto /> Image
								</MenuItem>
							</Menu>
						</>
					)}
				</Box>
				<Box>
					<IconButton
						edge="end"
						color="secondary"
						onClick={edit ? handleClose : () => setEdit(true)}
					>
						{edit ? <Close /> : <Edit />}
					</IconButton>
				</Box>
			</>
		);
	};

	const components = {
		code({node, inline, className, children, ...props}) {
			const match = /language-(\w+)/.exec(className || "");
			return !inline && match ? (
				<Paper>
					<SyntaxHighlighter
						style={
							theme.palette.type == "dark"
								? materialOceanic
								: materialLight
						}
						language={match[1]}
						PreTag="div"
						children={String(children).replace(/\n$/, "")}
						className={classes.codeBlock}
						{...props}
					/>
				</Paper>
			) : (
				<code className={classes.inlineCode} {...props}>
					{children}
				</code>
			);
		},
		table({children, ...props}) {
			return (
				<TableContainer component={Paper} {...props}>
					<Table>{children}</Table>
				</TableContainer>
			);
		},
		tr({children, ...props}) {
			return (
				<TableRow className={classes.tableRow} {...props}>
					{children}
				</TableRow>
			);
		},
		td({children, ...props}) {
			return <TableCell {...props}>{children}</TableCell>;
		},
		th({children, ...props}) {
			return (
				<TableCell component="th" {...props}>
					<b>{children}</b>
				</TableCell>
			);
		},
		a({children, ...props}) {
			return <Linkurl {...props}>{children}</Linkurl>;
		},
	};

	const markdownContent = () => {
		if (edit) {
			return (
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<TextField
							variant="filled"
							multiline
							fullWidth
							value={text}
							onChange={(e) => {
								setText(e.target.value);
								setCursor({
									start: e.target.selectionStart,
									end: e.target.selectionEnd,
								});
							}}
							onClick={(e) => {
								setCursor({
									start: e.target.selectionStart,
									end: e.target.selectionEnd,
								});
							}}
						/>
					</Grid>
					<Grid item xs={6}>
						<ReactMarkdown
							remarkPlugins={[gfm]}
							rehypePlugins={[rehypeRaw]}
							components={components}
							children={text}
							className={classes.markdown}
						/>
					</Grid>
				</Grid>
			);
		} else {
			return (
				<ReactMarkdown
					remarkPlugins={[gfm]}
					rehypePlugins={[rehypeRaw]}
					components={components}
					children={text}
					className={classes.markdown}
				/>
			);
		}
	};

	if (noteResult.loading) {
		return <>Loading... </>;
	}

	if (noteResult.error) {
		return <>Error :(</>;
	}

	if (!isNew && id && !noteResult.data?.noteById) {
		return <>Error :(</>;
	}

	return (
		<>
			<Prompt
				when={text !== savedText || filename !== savedFilename}
				message="You have unsaved changes, are you sure you want to leave?"
			/>
			<ToolbarCustom divider={false}>{toolbarButtons()}</ToolbarCustom>
			<Box display="flex" justifyContent="start">
				<Typography variant="body2" className={classes.info}>
					Created at:{" "}
					{!isNew &&
						getDateString(noteResult.data.noteById.createdAt)}
				</Typography>
				<Typography variant="body2" className={classes.info}>
					Updated at:{" "}
					{!isNew &&
						getDateString(noteResult.data.noteById.updatedAt)}
				</Typography>
				{(text !== savedText || filename !== savedFilename) && (
					<Typography variant="body2" className={classes.info}>
						*You have unsaved changes*
					</Typography>
				)}
			</Box>
			<Divider className={classes.divider} />
			{markdownContent()}
		</>
	);
}
