import React from "react";
import {useQuery, useMutation, gql} from "@apollo/client";
import {useParams} from "react-router-dom";

import {
	Paper,
	Box,
	Typography,
	Divider,
	ButtonGroup,
	Button,
	IconButton,
} from "@material-ui/core";
import {Check} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import Grocery from "./Grocery";

import ToolbarCustom from "../ToolbarCustom";
import AddDialog from "./AddDialog";
import ListRenderer from "./ListRenderer";

export const LIST_QUERY = gql`
	query List($id: Int!) {
		groceryListById(id: $id) {
			name
			groceries {
				id
				name
				needed
			}
		}
	}
`;

const useStyles = makeStyles((theme) => ({
	divider: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	paper: {
		padding: theme.spacing(2),
	},
}));

export default function List() {
	const {id} = useParams();
	const {loading, error, data, refetch} = useQuery(LIST_QUERY, {
		variables: {
			id: Number(id),
		},
	});
	const [view, setView] = React.useState(
		localStorage.getItem("groceryView") === "list"
	);
	const [needed, setNeeded] = React.useState([]);
	const [other, setOther] = React.useState([]);
	const [addOpen, setAddOpen] = React.useState(false);
	const classes = useStyles();

	React.useEffect(() => {
		if (data?.groceryListById) {
			let needed = [];
			let other = [];
			data.groceryListById.groceries.forEach((item) => {
				if (item.needed) {
					needed.push(item);
				} else {
					other.push(item);
				}
			});
			needed.sort((a, b) => a.name > b.name);
			other.sort((a, b) => a.name > b.name);
			setNeeded(needed);
			setOther(other);
		}
	}, [data]);

	React.useEffect(() => {
		localStorage.setItem("groceryView", view ? "list" : "grid");
	}, [view]);

	if (loading || !data.groceryListById) return <>Loading...</>;
	if (error) return <>Error :(</>;
	return (
		<>
			<AddDialog open={addOpen} setOpen={setAddOpen} items={other} />
			<ListRenderer
				title={data.groceryListById.name}
				items={needed}
				setAddOpen={setAddOpen}
				variant="grocery"
			/>
		</>
	);
}
