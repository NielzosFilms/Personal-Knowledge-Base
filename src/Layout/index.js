import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import TopBar from "./TopBar";
import LeftMenu from "./LeftMenu";
import ContentWrapper from "./ContentWrapper";
import { AuthenticationProvider } from "../services";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(6),
        // marginLeft: 240,
        paddingBottom: theme.spacing(20),
    },
}));

export default function Layout({ children, authenticatedUser }) {
    const classes = useStyles();
    return (
        <>
            <AuthenticationProvider>
                <TopBar />
            </AuthenticationProvider>
            {/* <LeftMenu /> */}
            <main className={classes.root}>
                <ContentWrapper>{children}</ContentWrapper>
            </main>
        </>
    );
}
