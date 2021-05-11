import React from "react";
import {useQuery, gql} from "@apollo/client";
import {useHistory} from "react-router-dom";

import {
	TableContainer,
	Table,
	TableCell,
	TableRow,
	TableHead,
	Paper,
	TableBody,
	IconButton,
	Box,
	Toolbar,
} from "@material-ui/core";
import {Launch, EditOutlined, Refresh} from "@material-ui/icons";

import ToolbarCustom from "../ToolbarCustom";

import {getDateString} from "../../services/dateFunctions";

const QUERY_USERS = gql`
	query {
		users {
			id
			name
			admin
			createdAt
			updatedAt
		}
	}
`;

export default function UserList() {
	const {loading, error, data, refetch} = useQuery(QUERY_USERS);
	const [users, setUsers] = React.useState([]);
	const history = useHistory();

	React.useEffect(() => {
		if (data?.users) {
			setUsers(data.users);
		}
	}, [data]);

	if (loading) return <>Loading...</>;
	if (error) return <>Error :(</>;

	const redirect = (to) => {
		history.push(to);
	};

	return (
		<>
			<ToolbarCustom>
				<Box
					display="flex"
					justifyContent="space-between"
					style={{width: "100%"}}
				>
					<Box display="flex" alignItems="center"></Box>
					<Box display="flex" alignItems="center">
						<IconButton color="secondary" onClick={() => refetch()}>
							<Refresh />
						</IconButton>
					</Box>
				</Box>
			</ToolbarCustom>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableCell>Username</TableCell>
						<TableCell>Is admin</TableCell>
						<TableCell align="right">Created at</TableCell>
						<TableCell align="right">Updated at</TableCell>
						<TableCell align="right">Actions</TableCell>
					</TableHead>
					<TableBody>
						{users.map((user) => (
							<TableRow
								key={user.id}
								hover
								style={{cursor: "pointer"}}
								onClick={() =>
									redirect(`/admin/users/edit/${user.id}`)
								}
							>
								<TableCell>{user.name}</TableCell>
								<TableCell>
									{user.admin ? "Yes" : "No"}
								</TableCell>
								<TableCell align="right">
									{getDateString(user.createdAt)}
								</TableCell>
								<TableCell align="right">
									{getDateString(user.updatedAt)}
								</TableCell>
								<TableCell align="right">
									<Box
										display="flex"
										justifyContent="flex-end"
									>
										<IconButton
											onClick={() =>
												redirect(
													`/admin/users/edit/${user.id}`
												)
											}
											color="secondary"
											size="small"
										>
											<EditOutlined />
										</IconButton>
									</Box>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
