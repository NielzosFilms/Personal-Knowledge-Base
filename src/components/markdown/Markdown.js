import React from "react";
import ReactMarkdown from "react-markdown";
import MDEditor from "@uiw/react-md-editor";
import {
    TextareaAutosize,
    IconButton,
    Toolbar,
    Divider,
    Paper,
    AppBar,
} from "@material-ui/core";
import { Edit, Close } from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";

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

export default function Markdown() {
    const classes = useStyles();
    const theme = useTheme();
    const [text, setText] = React.useState("");
    const [edit, setEdit] = React.useState(false);

    const fetchData = async () => {
        fetch(test)
            .then((res) => res.text())
            .then((text) => setText(text));
    };

    if (text === "") fetchData();

    if (edit) {
        return (
            <>
                <AppBar
                    color="inherit"
                    position="sticky"
                    className={classes.appBar}
                >
                    <Toolbar variant="dense">
                        <div className={classes.leftBtnGroup}></div>
                        <div>
                            <IconButton
                                edge="end"
                                color="secondary"
                                onClick={() => setEdit(false)}
                            >
                                <Close />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <Divider className={classes.divider} />
                <MDEditor
                    hideToolbar
                    fullscreen={false}
                    visiableDragbar={false}
                    value={text}
                    onChange={setText}
                    minHeight={400}
                    className={theme.palette.type === "dark" && classes.invert}
                />
            </>
        );
    }

    return (
        <>
            <AppBar
                color="inherit"
                position="sticky"
                className={classes.appBar}
            >
                <Toolbar variant="dense">
                    <div className={classes.leftBtnGroup}></div>
                    <div>
                        <IconButton
                            edge="end"
                            color="secondary"
                            onClick={() => setEdit(true)}
                        >
                            <Edit />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <Divider className={classes.divider} />
            <MDEditor.Markdown source={text} />
            {/* <ReactMarkdown>{text}</ReactMarkdown> */}
        </>
    );
}
