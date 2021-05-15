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
	Table,
	TableContainer,
	TableRow,
	TableCell,
	TableHead,
	TableBody,
	IconButton,
} from "@material-ui/core";
import {Check} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import Grocery from "./Grocery";

import ToolbarCustom from "../ToolbarCustom";

const LIST_QUERY = gql`
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
	title: {
		flexGrow: 1,
		textOverflow: "ellipsis",
		overflow: "hidden",
		whiteSpace: "nowrap",
	},
	button: {
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
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
			<ToolbarCustom>
				<Box display="flex" style={{width: "100%"}}>
					<Typography variant="h6" className={classes.title}>
						{data.groceryListById.name}
					</Typography>
					<Box display="flex">
						<Button
							variant="contained"
							color="secondary"
							// onClick={() => setView(!view)}
							className={classes.button}
						>
							Add
						</Button>
						<ButtonGroup color="primary">
							<Button
								variant={view ? "contained" : "outlined"}
								onClick={() => setView(!view)}
							>
								List
							</Button>
							<Button
								variant={!view ? "contained" : "outlined"}
								onClick={() => setView(!view)}
							>
								Grid
							</Button>
						</ButtonGroup>
					</Box>
				</Box>
			</ToolbarCustom>
			{view ? (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{needed.map((item, index) => (
								<TableRow hover key={index}>
									<TableCell>{item.name}</TableCell>
									<TableCell align="right">
										<Button color="secondary" size="small">
											Check
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<Box display="flex" flexWrap="wrap">
					{needed.map((item, index) => (
						<Grocery key={index} {...item} />
					))}
				</Box>
			)}
		</>
	);
}
