import React from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
    Paper,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import {
    Menu,
    ChevronLeft,
    ChevronRight,
    Home,
    ExitToApp,
    Note,
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        zIndex: theme.zIndex.drawer + 1,
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    },
    title: {
        flexGrow: 1,
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "space-between",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },
    selected: {
        color: theme.palette.secondary,
    },
}));

const USER_QUERY = gql`
    query {
        getAuthenticatedUser {
            id
            name
        }
    }
`;

const LOGOUT_QUERY = gql`
    query {
        logout
    }
`;

const menuButtons = [
    {
        text: "Home",
        icon: <Home />,
        route: "/",
    },
    {
        text: "Notes",
        icon: <Note />,
        route: "/notes",
    },
];

export default function TopBar({ setUpdateTime }) {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const [doLogout, logoutResult] = useLazyQuery(LOGOUT_QUERY);

    const handleClick = (route) => {
        history.push(route);
        setOpen(false);
    };

    const handleLogout = () => {
        doLogout();
    };

    if (logoutResult.data?.logout) {
        localStorage.removeItem("token");
        setUpdateTime(new Date());
    }

    return (
        <>
            <AppBar
                position="fixed"
                color="primary"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap className={classes.title}>
                        Knowledge Base
                    </Typography>
                    {/* <Typography noWrap>
                        {userQuery.data.getAuthenticatedUser.name}
                    </Typography> */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={() => setOpen(true)}
                        className={clsx(open && classes.hide)}
                    >
                        <Menu />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
                onMouseLeave={() => setOpen(false)}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={() => setOpen(false)}>
                        {theme.direction === "ltr" ? (
                            <ChevronRight />
                        ) : (
                            <ChevronLeft />
                        )}
                    </IconButton>
                    <IconButton onClick={handleLogout}>
                        <ExitToApp />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {menuButtons.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => handleClick(item.route)}
                            selected={history.location.pathname === item.route}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
}
