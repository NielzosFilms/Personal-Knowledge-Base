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
	TextField,
} from "@material-ui/core";
import {Check, Close} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import Grocery from "./Grocery";

import ToolbarCustom from "../ToolbarCustom";
import AddDialog from "./AddDialog";

const useStyles = makeStyles((theme) => ({
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

export default function ListRenderer({
	title,
	items,
	setAddOpen = null,
	variant = "grocery" | "archive",
	...props
}) {
	const [view, setView] = React.useState(
		localStorage.getItem("groceryView") === "list"
	);
	const [search, setSearch] = React.useState("");
	const [stateItems, setStateItems] = React.useState(items);
	const classes = useStyles();

	React.useEffect(() => {
		localStorage.setItem("groceryView", view ? "list" : "grid");
	}, [view]);

	React.useEffect(() => {
		if (!search) {
			setStateItems(items);
		} else {
			setStateItems(
				items.filter((item) =>
					item.name.toLowerCase().includes(search.toLowerCase())
				)
			);
		}
	}, [search]);

	React.useEffect(() => {
		if (!search) {
			setStateItems(items);
		}
	});

	const clearSearch = () => {
		setSearch("");
	};

	return (
		<>
			<ToolbarCustom>
				<Box display="flex" style={{width: "100%"}} flexWrap="wrap">
					<Box
						display="flex"
						alignItems="center"
						className={classes.title}
					>
						<Typography variant="h6">{title}</Typography>
					</Box>
					<Box display="flex" alignItems="center">
						<TextField
							label="Search..."
							size="small"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							InputProps={{
								endAdornment: (
									<IconButton
										size="small"
										onClick={clearSearch}
									>
										<Close />
									</IconButton>
								),
							}}
						/>
						{variant === "grocery" ? (
							<Button
								variant="contained"
								color="secondary"
								onClick={() => setAddOpen(true)}
								className={classes.button}
							>
								Add
							</Button>
						) : (
							<Button
								variant="contained"
								color="secondary"
								onClick={() => props.setCreateOpen(true)}
								className={classes.button}
							>
								Add new item
							</Button>
						)}
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
							{stateItems.map((item, index) => (
								<Grocery
									key={index}
									{...item}
									variant={variant}
									view={view}
									clearSearch={clearSearch}
								/>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<Box display="flex" flexWrap="wrap">
					{stateItems.map((item, index) => (
						<Grocery
							key={index}
							{...item}
							variant={variant}
							view={view}
							clearSearch={clearSearch}
						/>
					))}
				</Box>
			)}
		</>
	);
}
