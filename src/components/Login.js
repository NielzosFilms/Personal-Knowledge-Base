import React from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";
import {
    TextField,
    Button,
    Paper,
    Container,
    FormControl,
    Grid,
    AppBar,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Autorenew } from "@material-ui/icons";
import { useHistory, Redirect } from "react-router-dom";

const LOGIN_QUERY = gql`
    query Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            success
            token
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(12),
    },
    paper: {
        margin: theme.spacing(3),
        marginLeft: "auto",
        marginRight: "auto",
        padding: theme.spacing(4),
        width: "fit-content",
    },
    formComponent: {
        margin: theme.spacing(1.5),
    },
}));

export default function Login({ setUpdateTime }) {
    const [execLogin, loginResult] = useLazyQuery(LOGIN_QUERY);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const classes = useStyles();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        execLogin({
            variables: {
                username,
                password,
            },
        });
    };

    React.useEffect(() => {
        if (loginResult.data) {
            if (loginResult.data.login.success) {
                localStorage.setItem("token", loginResult.data.login.token);
                setUpdateTime(new Date());
            }
        }
    }, [loginResult]);

    return (
        <>
            <AppBar position="fixed" color="primary">
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Knowledge Base
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container className={classes.root}>
                <Paper className={classes.paper}>
                    <Typography variant="h3">Login</Typography>
                    <form onSubmit={handleSubmit}>
                        <FormControl>
                            <TextField
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                label="Username"
                                variant="filled"
                                size="small"
                                className={classes.formComponent}
                            />
                            <TextField
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                                variant="filled"
                                size="small"
                                className={classes.formComponent}
                            />
                            <Button
                                type="submit"
                                color="secondary"
                                variant="contained"
                                className={classes.formComponent}
                            >
                                Login
                            </Button>
                        </FormControl>
                    </form>
                </Paper>
            </Container>
        </>
    );
}
