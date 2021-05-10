import React from "react";
import {useQuery, gql} from "@apollo/client";
import {useParams} from "react-router-dom";

import {makeStyles, useTheme} from "@material-ui/core/styles";
import {Box, Typography, Divider} from "@material-ui/core";
import {} from "@material-ui/icons";

import ToolbarCustom from "../ToolbarCustom";
import {getDateString} from "../../services/dateFunctions";
import reactDom from "react-dom";

const QUERY_USER = gql`
	query UserById($id: Int!) {
		userById(id: $id) {
			id
			name
			admin
			createdAt
			updatedAt
		}
	}
`;

const useStyles = makeStyles((theme) => ({
	divider: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	info: {
		marginTop: theme.spacing(1),
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		opacity: 0.5,
	},
}));

export default function EditUser() {
	const {id} = useParams();
	const {loading, error, data} = useQuery(QUERY_USER, {
		variables: {
			id: Number(id),
		},
	});
	const [user, setUser] = React.useState({});
	const classes = useStyles();

	React.useEffect(() => {
		if (data?.userById) {
			setUser(data.userById);
		}
	}, [data]);

	if (loading) return <>Loading...</>;
	if (error) return <>Error :(</>;
	return (
		<>
			<ToolbarCustom divider={false}></ToolbarCustom>
			<Box display="flex" justifyContent="start">
				<Typography variant="body2" className={classes.info}>
					Created at: {getDateString(data.userById.createdAt)}
				</Typography>
				<Typography variant="body2" className={classes.info}>
					Updated at: {getDateString(data.userById.updatedAt)}
				</Typography>
			</Box>
			<Divider className={classes.divider} />
			{JSON.stringify(user)}
		</>
	);
}
