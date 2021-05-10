import React from "react";
import {useQuery, gql} from "@apollo/client";

const USER_QUERY = gql`
	query UserQuery {
		getAuthenticatedUser {
			id
			name
			admin
			createdAt
			updatedAt
		}
	}
`;

export default function AuthenticatedUserProvider({children}) {
	const {error, loading, data} = useQuery(USER_QUERY);
	const [user, setUser] = React.useState({});

	React.useEffect(() => {
		if (data) {
			setUser(data.getAuthenticatedUser);
		}
	}, [loading]);

	if (loading) return <>Loading...</>;
	if (error) return <>Error :(</>;

	if (!user) return <></>;

	return (
		<>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(child, {authenticatedUser: user});
				} else {
					return child;
				}
			})}
		</>
	);
}
