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

import ToolbarCustom from "../../ToolbarCustom";

import {getDateString} from "../../../services/dateFunctions";

const QUERY_GROUPS = gql`
	query {
		userGroups {
			id
			name
			createdAt
			updatedAt
		}
	}
`;

export default function List() {
	const {loading, error, data, refetch} = useQuery(QUERY_GROUPS);
	const [groups, setGroups] = React.useState([]);
	const history = useHistory();

	React.useEffect(() => {
		if (data?.userGroups) {
			setGroups(data.userGroups);
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
						<TableCell>Name</TableCell>
						<TableCell align="right">Created at</TableCell>
						<TableCell align="right">Updated at</TableCell>
						<TableCell align="right">Actions</TableCell>
					</TableHead>
					<TableBody>
						{groups.map((group) => (
							<TableRow
								key={group.id}
								hover
								style={{cursor: "pointer"}}
								onClick={() =>
									redirect(
										`/admin/userGroups/edit/${group.id}`
									)
								}
							>
								<TableCell>{group.name}</TableCell>
								<TableCell align="right">
									{getDateString(group.createdAt)}
								</TableCell>
								<TableCell align="right">
									{getDateString(group.updatedAt)}
								</TableCell>
								<TableCell align="right">
									<Box
										display="flex"
										justifyContent="flex-end"
									>
										<IconButton
											onClick={() =>
												redirect(
													`/admin/userGroups/edit/${group.id}`
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
