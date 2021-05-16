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
	TableRow,
	TableCell,
	IconButton,
} from "@material-ui/core";
import {DeleteOutline} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router-dom";
import {useSnackbar} from "notistack";

import {LIST_QUERY} from "./List";

const UPDATE_GROCERY = gql`
	mutation UpdateGrocery($id: Int!, $name: String, $needed: Boolean) {
		updateGrocery(id: $id, name: $name, needed: $needed) {
			id
		}
	}
`;

const DELETE_GROCERY = gql`
	mutation DeleteGrocery($id: Int!) {
		deleteGrocery(id: $id)
	}
`;

const useStyles = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(0.5),
		flexGrow: 1,
	},
	delete: {
		marginLeft: theme.spacing(2),
	},
}));

export default function Grocery({
	id,
	name,
	needed,
	view,
	variant = "grocery" | "archive",
	clearSearch,
}) {
	const url_params = useParams();
	const REFETCH_QUERIES = {
		refetchQueries: [
			{
				query: LIST_QUERY,
				variables: {
					id: Number(url_params.id),
				},
			},
		],
	};
	const [updateGrocery, updateGroceryRes] = useMutation(
		UPDATE_GROCERY,
		REFETCH_QUERIES
	);
	const [deleteGrocery, deleteGroceryRes] = useMutation(
		DELETE_GROCERY,
		REFETCH_QUERIES
	);
	const classes = useStyles();
	const {enqueueSnackbar} = useSnackbar();

	const handleCheck = () => {
		updateGrocery({
			variables: {
				id,
				needed: !needed,
			},
		});
		if (needed) {
			enqueueSnackbar(`${name} has been checked!`, {variant: "success"});
		} else {
			enqueueSnackbar(`${name} has been added to the list!`, {
				variant: "success",
			});
		}
		clearSearch();
	};

	const handleDelete = () => {
		deleteGrocery({
			variables: {
				id,
			},
		});
		enqueueSnackbar(`${name} has been deleted.`, {variant: "info"});
		clearSearch();
	};

	if (view) {
		return (
			<TableRow hover>
				<TableCell>{name}</TableCell>
				<TableCell align="right">
					<Button
						color="secondary"
						size="small"
						onClick={handleCheck}
					>
						{variant === "grocery" ? "Check" : "Add to list"}
					</Button>
					{variant === "archive" && (
						<IconButton
							size="small"
							color="secondary"
							className={classes.delete}
							onClick={handleDelete}
						>
							<DeleteOutline />
						</IconButton>
					)}
				</TableCell>
			</TableRow>
		);
	} else {
		return (
			<Card className={classes.root}>
				<CardContent>
					<Typography>{name}</Typography>
				</CardContent>
				<CardActions>
					<Button color="secondary" onClick={handleCheck}>
						{variant === "grocery" ? "Check" : "Add to list"}
					</Button>
					{variant === "archive" && (
						<IconButton
							size="small"
							color="secondary"
							className={classes.delete}
							onClick={handleDelete}
						>
							<DeleteOutline />
						</IconButton>
					)}
				</CardActions>
			</Card>
		);
	}
}
