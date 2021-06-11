import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useParams, useHistory } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
    Box,
    Typography,
    Divider,
    IconButton,
    Grid,
    Paper,
    TextField,
    Switch,
    FormControlLabel,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@material-ui/core";
import { EditOutlined, Launch } from "@material-ui/icons";
import { getDateString, DataProvider } from "../services";

const QUERY_GROUP = gql`
    query UserGroup($id: Int!) {
        userGroupById(id: $id) {
            id
            name
            users {
                id
                name
            }
            groceryLists {
                id
                name
                createdAt
                updatedAt
            }
            createdAt
            updatedAt
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    divider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    info: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        opacity: 0.5,
    },
    width100: {
        width: "100%",
    },
    paper: {
        padding: theme.spacing(1),
    },
    field: {
        margin: theme.spacing(1),
    },
}));

export default function UserGroup() {
    const { id } = useParams();
    const { loading, error, data } = useQuery(QUERY_GROUP, {
        variables: {
            id: Number(id),
        },
    });
    const classes = useStyles();
    const history = useHistory();

    if (loading) return <>Loading...</>;
    if (error) return <>Error :(</>;
    if (!data.userGroupById) return <></>;
    return (
        <>
            <Typography variant="h2">User group</Typography>
            <Typography variant="h3">{data.userGroupById.name}</Typography>
            <Divider className={classes.divider} />
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4">Grocery Lists</Typography>
                    <Paper className={classes.paper}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">
                                            Created at
                                        </TableCell>
                                        <TableCell align="right">
                                            Updated at
                                        </TableCell>
                                        <TableCell align="right">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.userGroupById.groceryLists.map(
                                        (list) => (
                                            <TableRow
                                                key={list.id}
                                                hover
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                    history.push(
                                                        `/userGroups/groceryList/${list.id}`
                                                    )
                                                }
                                            >
                                                <TableCell>
                                                    {list.name}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {getDateString(
                                                        list.createdAt
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {getDateString(
                                                        list.updatedAt
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box
                                                        display="flex"
                                                        justifyContent="flex-end"
                                                    >
                                                        <IconButton
                                                            onClick={() =>
                                                                history.push(
                                                                    `/userGroups/groceryList/${list.id}`
                                                                )
                                                            }
                                                            color="secondary"
                                                            size="small"
                                                        >
                                                            <Launch />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4">Other users</Typography>
                    <Paper className={classes.paper}>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {data.userGroupById.users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
