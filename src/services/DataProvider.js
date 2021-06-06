import {useState, useEffect, cloneElement} from "react";
import {useQuery} from "@apollo/client";
import {CircularProgress, Box, Typography} from "@material-ui/core";
import {useSnackbar} from "notistack";

export default function DataProvider({query, variables, queryName, children}) {
	const {error, loading, data, refetch} = useQuery(query, {
		variables,
	});
	const [resData, setResData] = useState(null);
	const {enqueueSnackbar} = useSnackbar();

	useEffect(() => {
		if (data) {
			setResData(data[queryName]);
		} else if (error) {
			enqueueSnackbar(error.message, {variant: "error"});
		}
	}, [loading]);

	if (loading)
		return (
			<Box display="flex" justifyContent="center">
				<CircularProgress color="primary" />
			</Box>
		);
	if (error)
		return (
			<>
				<Typography variant="h2">Error :(</Typography>
				<Typography>{error.message}</Typography>
			</>
		);

	// if (!resData) return <Typography variant="h2">No data found.</Typography>;

	return <>{cloneElement(children, {data: resData, refetch})}</>;
}
