import React from "react";
import {useQuery, useMutation, gql} from "@apollo/client";

import {
	Paper,
	Box,
	Typography,
	Divider,
	Card,
	CardContent,
	CardActions,
	Button,
} from "@material-ui/core";
import {} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(0.5),
		flexGrow: 1,
	},
}));

export default function Grocery({id, name, needed}) {
	const classes = useStyles();
	return (
		<Card className={classes.root}>
			<CardContent>
				<Typography>{name}</Typography>
			</CardContent>
			<CardActions>
				<Button color="secondary">Check</Button>
			</CardActions>
		</Card>
	);
}
