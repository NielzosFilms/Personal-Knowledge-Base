import {makeStyles, useTheme} from "@material-ui/core/styles";
import {Container} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		paddingTop: theme.spacing(4),
	},
}));

export default function ContentWrapper({children}) {
	const classes = useStyles();

	return <Container className={classes.root}>{children}</Container>;
}
