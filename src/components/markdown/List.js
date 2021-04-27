import React from "react";
import { useQuery, gql } from "@apollo/client";
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
} from "@material-ui/core";
import { Edit, Launch, DeleteOutline } from "@material-ui/icons";
import { getDateString } from "../../services/dateFunctions";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const NOTE_QUERY = gql`
    query Notes {
        notes {
            id
            filename
            content
            createdAt
            updatedAt
        }
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
}));

export default function List() {
    const notesResult = useQuery(NOTE_QUERY);
    const [notes, setNotes] = React.useState([]);
    const history = useHistory();
    const classes = useStyles();

    React.useEffect(() => {
        console.log(notesResult.data);
        if (notesResult.data?.notes) {
            setNotes(notesResult.data.notes);
        }
    }, [notesResult.loading]);

    if (notesResult.loading) {
        return <>Loading...</>;
    }

    if (notesResult.error) {
        return <>Error :(</>;
    }

    const handleEditClick = (id) => {
        history.push(`/notes/edit/${id}`);
    };

    return (
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
                    {notes.map((note) => (
                        <TableRow
                            key={note.id}
                            hover
                            // onClick={() => handleEditClick(note.id)}
                            // className={classes.tableRow}
                        >
                            <TableCell component="th" scope="row">
                                {note.filename}
                            </TableCell>
                            <TableCell align="right">
                                {getDateString(note.createdAt)}
                            </TableCell>
                            <TableCell align="right">
                                {getDateString(note.updatedAt)}
                            </TableCell>
                            <TableCell align="right">
                                <IconButton
                                    onClick={() => handleEditClick(note.id)}
                                    color="secondary"
                                    className={classes.actionButton}
                                    size="small"
                                >
                                    <Launch />
                                </IconButton>
                                <IconButton
                                    // onClick={() => handleEditClick(note.id)}
                                    color="secondary"
                                    className={classes.actionButton}
                                    size="small"
                                >
                                    <DeleteOutline />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
