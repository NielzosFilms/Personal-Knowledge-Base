import { useState, useEffect, cloneElement } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Box, CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router";
import { useSnackbar } from "notistack";

const QUERY_USER = gql`
    query GetUser {
        getAuthenticatedUser {
            id
            name
            email
            admin
            userGroups {
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

const MUT_LOGIN = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            success
            token
        }
    }
`;

const MUT_LOGOUT = gql`
    mutation Logout {
        logout
    }
`;

export function AuthenticationProvider({ children, ...props }) {
    const queryUserResult = useQuery(QUERY_USER);
    const [login, loginResult] = useMutation(MUT_LOGIN);
    const [logout, logoutResult] = useMutation(MUT_LOGOUT);
    const [user, setUser] = useState(null);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();

    useEffect(() => {
        if (queryUserResult?.data?.getAuthenticatedUser) {
            setUser(queryUserResult.data.getAuthenticatedUser);
        }
    }, [queryUserResult.data]);

    useEffect(() => {
        if (loginResult?.data?.login) {
            if (loginResult.data.login.success) {
                localStorage.removeItem("token");
                localStorage.removeItem("breadCrums");
                localStorage.removeItem("folderId");
                localStorage.removeItem("noteHistory");
                localStorage.setItem("token", loginResult.data.login.token);
                history.push("/");
                queryUserResult.refetch();
                enqueueSnackbar("You are now logged in!", {
                    variant: "success",
                });
            }
        }
    }, [loginResult.loading]);

    useEffect(() => {
        if (logoutResult?.data?.logout) {
            localStorage.removeItem("token");
            localStorage.removeItem("breadCrums");
            localStorage.removeItem("folderId");
            localStorage.removeItem("noteHistory");
            history.push("/login");
            setUser(null);
            queryUserResult.refetch();
        }
        if (loginResult.error) {
            enqueueSnackbar(loginResult.error.graphQLErrors[0].message, {
                variant: "error",
            });
        }
    }, [logoutResult.loading]);

    const handleLogin = (username, password) => {
        login({
            variables: {
                username,
                password,
            },
        });
    };

    if (queryUserResult.loading)
        return (
            <Box position="absolute" style={{ bottom: 20, left: 20 }}>
                <CircularProgress />
            </Box>
        );

    const returnData = {
        loggedIn: Boolean(queryUserResult?.data?.getAuthenticatedUser),
        authenticatedUser: queryUserResult?.data?.getAuthenticatedUser,
        login: handleLogin,
        logout: logout,
        ...props,
    };

    if (Array.isArray(children)) {
        return <>{children.map((child) => cloneElement(child, returnData))}</>;
    }
    return <>{cloneElement(children, returnData)}</>;
}
