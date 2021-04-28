import React from "react";
import {makeStyles} from "@material-ui/core/styles";

import {
	Drawer,
	AppBar,
	Toolbar,
	List,
	Typography,
	Divider,
	ListItem,
	ListItemIcon,
	ListItemText,
	IconButton,
} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {getNoteHistory} from "../services/noteHistory";
import {addNoteToHistory} from "../services/noteHistory";
import {useQuery, gql} from "@apollo/client";

import {Launch} from "@material-ui/icons";
import {isNonNullType} from "graphql";

const NOTE_QUERY = gql`
	query Notes($ids: [Int]!) {
		noteWithIds(ids: $ids) {
			id
			filename
		}
	}
`;

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerContainer: {
		overflow: "auto",
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
}));

export default function LeftMenu() {
	const classes = useStyles();
	const {loading, error, data, refetch} = useQuery(NOTE_QUERY, {
		variables: {
			ids: getNoteHistory(),
		},
	});
	const [notes, setNotes] = React.useState([]);
	const history = useHistory();

	history.listen(() => {
		refetch();
	});

	React.useEffect(() => {
		if (data) {
			setNotes(data.noteWithIds);
		}
	}, [loading]);

	const onClick = (id) => {
		addNoteToHistory(id);
		history.push(`/notes/edit/${id}`);
	};

	return (
		<Drawer
			className={classes.drawer}
			variant="permanent"
			classes={{
				paper: classes.drawerPaper,
			}}
		>
			<Toolbar />
			<div className={classes.drawerContainer}>
				<List>
					<ListItem>
						<Typography variant="h6">Note history</Typography>
					</ListItem>
				</List>
				<Divider />
				{loading && "Loading..."}
				{error && "Error :("}
				<List>
					{notes.map((note, index) => (
						<ListItem
							button
							key={index}
							onClick={() => onClick(note.id)}
						>
							<Typography style={{flexGrow: 1}}>
								{note.filename}
							</Typography>
							<IconButton size="small" color="secondary">
								<Launch />
							</IconButton>
						</ListItem>
					))}
				</List>
			</div>
		</Drawer>
	);
}
