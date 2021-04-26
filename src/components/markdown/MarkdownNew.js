import React from "react";
import ReactMarkdown from "react-markdown";
import {
    TextareaAutosize,
    TextField,
    IconButton,
    Toolbar,
    Divider,
    Paper,
    AppBar,
    Grid,
} from "@material-ui/core";
import { Edit, Close, Save, GetApp } from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useHotkeys } from "react-hotkeys-hook";

import test from "./test.md";

const useStyles = makeStyles((theme) => ({
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    invert: {
        filter: "invert(0.9)",
    },
    leftBtnGroup: {
        flexGrow: 1,
    },
    appBar: {
        top: 75,
    },
}));

export default function MarkdownNew() {
    const classes = useStyles();
    const theme = useTheme();
    const [text, setText] = React.useState("");
    const [filename, setFilename] = React.useState("test");
    const [edit, setEdit] = React.useState(false);

    useHotkeys("ctrl+s", (e) => {
        handleSave();
        e.preventDefault();
    });

    const fetchData = async () => {
        fetch(test)
            .then((res) => res.text())
            .then((text) => setText(text));
    };
    if (text === "") fetchData();

    const handleClose = () => {
        if (window.confirm("You have unsaved changes!")) {
            setEdit(false);
        }
    };

    const handleSave = () => {
        console.log("save");
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
                        <TextField
                            label="Filename"
                            size="small"
                            disabled
                            color="secondary"
                            value={filename}
                        />
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

    return (
        <>
            <AppBar
                color="inherit"
                position="sticky"
                className={classes.appBar}
            >
                <Toolbar variant="dense">{toolbarButtons()}</Toolbar>
            </AppBar>
            <Divider className={classes.divider} />
            {markdownContent()}
        </>
    );
}
