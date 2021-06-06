import {gql} from "@apollo/client";

export const QUERY_USERS = gql`
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
