import { AppBar, Toolbar, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    divider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    appBar: {
        top: 75,
    },
}));

export default function ToolbarCustom({ children, divider = true }) {
    const classes = useStyles();
    return (
        <>
            <AppBar
                color="inherit"
                position="sticky"
                className={classes.appBar}
            >
                <Toolbar variant="dense">{children}</Toolbar>
            </AppBar>
            {divider && <Divider className={classes.divider} />}
        </>
    );
}
