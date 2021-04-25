import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import TopBar from "./TopBar";
import LeftMenu from "./LeftMenu";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(8),
    },
}));

export default function Layout({ children }) {
    const classes = useStyles();
    return (
        <>
            <TopBar />
            <LeftMenu />
            <main className={classes.root}>{children}</main>
        </>
    );
}
