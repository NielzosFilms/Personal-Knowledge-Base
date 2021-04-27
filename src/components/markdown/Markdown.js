import React from "react";
import ReactMarkdown from "react-markdown";
import {
    TextField,
    IconButton,
    Toolbar,
    Divider,
    AppBar,
    Grid,
    Typography,
    Box,
} from "@material-ui/core";
import { Edit, Close, Save, GetApp } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useHotkeys } from "react-hotkeys-hook";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useHistory, useParams } from "react-router-dom";

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
    leftBtnGroup: {
        flexGrow: 1,
    },
    appBar: {
        top: 75,
    },
    info: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        opacity: 0.5,
    },
}));

export default function MarkdownNew({ isNew = false }) {
    const { id } = useParams();
    const noteResult = useQuery(NOTE_QUERY, {
        variables: {
            id: Number(id || 0),
        },
    });
    const [createNote, createNoteResult] = useMutation(NOTE_CREATE);
    const [updateNote, updateNoteResult] = useMutation(NOTE_UPDATE);
    const classes = useStyles();
    const [text, setText] = React.useState("");
    const [filename, setFilename] = React.useState("");
    const [edit, setEdit] = React.useState(isNew);
    const history = useHistory();

    // useHotkeys("ctrl+s", (e) => {
    //     // Doesnt work for some reason
    //     handleSave();
    //     e.preventDefault();
    // });

    React.useEffect(() => {
        if (noteResult.data?.noteById && !isNew) {
            setText(noteResult.data.noteById.content);
            setFilename(noteResult.data.noteById.filename);
        }
    }, [noteResult.loading]);

    const handleSave = async () => {
        if (isNew) {
            createNote({
                variables: {
                    filename,
                    content: text,
                },
            });
        } else {
            updateNote({
                variables: {
                    id: Number(id),
                    filename,
                    content: text,
                },
            });
        }
    };

    React.useEffect(() => {
        if (createNoteResult.data?.createNote) {
            history.push(`/notes/edit/${createNoteResult.data.createNote.id}`);
        }
    }, [createNoteResult.loading]);

    React.useEffect(() => {
        noteResult.refetch();
    }, [updateNoteResult.loading]);

    const handleClose = () => {
        // if (window.confirm("You have unsaved changes!")) {
        setEdit(false);
        // }
    };

    const handleDownload = () => {
        console.log("download");
    };

    const toolbarButtons = () => {
        if (edit) {
            return (
                <>
                    <div className={classes.leftBtnGroup}>
                        <TextField
                            label="Filename"
                            size="small"
                            color="secondary"
                            required
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                        />
                        <IconButton color="secondary" onClick={handleSave}>
                            <Save />
                        </IconButton>
                        <IconButton color="secondary" onClick={handleDownload}>
                            <GetApp />
                        </IconButton>
                    </div>
                    <div>
                        <IconButton
                            edge="end"
                            color="secondary"
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className={classes.leftBtnGroup}>
                        <Typography variant="h6">{filename}</Typography>
                    </div>
                    <div>
                        <IconButton
                            edge="end"
                            color="secondary"
                            onClick={() => setEdit(true)}
                        >
                            <Edit />
                        </IconButton>
                    </div>
                </>
            );
        }
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
                            onChange={(e) => setText(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ReactMarkdown>{text}</ReactMarkdown>
                    </Grid>
                </Grid>
            );
        } else {
            return <ReactMarkdown>{text}</ReactMarkdown>;
        }
    };

    const getDateString = (input) => {
        const split = input.split("T");
        const date = split[0].split("-");
        const timeString = split[1].split(".");
        const time = timeString[0].split(":");
        return `${time[0]}:${time[1]} ${date[2]}-${date[1]}-${date[0]}`;
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
            <AppBar
                color="inherit"
                position="sticky"
                className={classes.appBar}
            >
                <Toolbar variant="dense">{toolbarButtons()}</Toolbar>
            </AppBar>
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
                {/* <Typography variant="body2" className={classes.info}>
                    Saved 00:00 ago
                </Typography> */}
            </Box>
            <Divider className={classes.divider} />
            {markdownContent()}
        </>
    );
}
