import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";

import { Home } from "@material-ui/icons";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: "auto",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function LeftMenu() {
    const classes = useStyles();
    // const [open, setOpen] = React.useState(true);

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Toolbar />
            <div className={classes.drawerContainer}>
                <List></List>
                <Divider />
                <List>
                    <ListItem button key={"Hello world"}>
                        <ListItemIcon></ListItemIcon>
                        <ListItemText primary={"Hello world"} />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
}
