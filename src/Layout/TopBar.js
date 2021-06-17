import React from "react";
import {useQuery, useLazyQuery, gql, useMutation} from "@apollo/client";
import clsx from "clsx";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import {
	Paper,
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Drawer,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Box,
	Link,
	CircularProgress,
} from "@material-ui/core";
import {
	Menu,
	ChevronLeft,
	ChevronRight,
	Home,
	ExitToApp,
	Note,
	People,
	Person,
} from "@material-ui/icons";
import {useHistory, Redirect} from "react-router-dom";
import {useSnackbar} from "notistack";
import About from "../components/About";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},
	appBar: {
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		zIndex: theme.zIndex.drawer + 1,
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginRight: drawerWidth,
	},
	title: {
		flexGrow: 1,
	},
	hide: {
		display: "none",
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerHeader: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: "space-between",
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginRight: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginRight: 0,
	},
	selected: {
		color: theme.palette.secondary,
	},
	spacer: {
		flexGrow: 1,
	},
	halfOpacity: {
		opacity: 0.5,
	},
	menuItem: {
		color: theme.palette.secondary.main,
	},
}));

const CHANGE_PASSWORD_MUTATION = gql`
	mutation SendChangePasswordEmail($email: String!) {
		sendChangePasswordEmail(email: $email)
	}
`;

const menuButtons = [
	{
		text: "Home",
		icon: <Home color="secondary" />,
		route: "/",
	},
	{
		text: "Notes",
		icon: <Note color="secondary" />,
		route: "/notes",
	},
];

const adminButtons = [
	{
		text: "Users",
		icon: <Person color="secondary" />,
		route: "/admin/users",
	},
	{
		text: "User Groups",
		icon: <Person color="secondary" />,
		route: "/admin/userGroups",
	},
];

export default function TopBar({authenticatedUser, logout}) {
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();
	const [open, setOpen] = React.useState(false);
	const [sendResetEmail, sendResetEmailResult] = useMutation(
		CHANGE_PASSWORD_MUTATION
	);
	const {enqueueSnackbar} = useSnackbar();

	const handleClick = (route) => {
		history.push(route);
		setOpen(false);
	};

	const handleLogout = () => {
		enqueueSnackbar("You have been logged out.", {variant: "info"});
		logout();
	};

	const handleChangePassword = () => {
		sendResetEmail({
			variables: {
				email: authenticatedUser.email,
			},
		});
	};

	React.useEffect(() => {
		if (sendResetEmailResult?.data?.sendChangePasswordEmail) {
			enqueueSnackbar(
				`Email has been sent to: ${authenticatedUser.email}`,
				{variant: "info"}
			);
		}
	}, [sendResetEmailResult.loading]);

	if (!authenticatedUser) return <>Error :(</>;

	const userGroupButtons = [
		...authenticatedUser?.userGroups.map((group) => ({
			text: group.name,
			icon: <People color="secondary" />,
			route: `/userGroups/${group.id}`,
		})),
	];

	return (
		<>
			<AppBar
				position="fixed"
				color="primary"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open,
				})}
			>
				<Toolbar>
					<Typography variant="h4" noWrap className={classes.title}>
						EXO
					</Typography>
					{/* <Typography noWrap>{authenticatedUser.name}</Typography> */}
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="end"
						onClick={() => setOpen(true)}
						className={clsx(open && classes.hide)}
					>
						<Menu />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="right"
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}
				onMouseLeave={() => setOpen(false)}
			>
				<div className={classes.drawerHeader}>
					<IconButton onClick={() => setOpen(false)}>
						{theme.direction === "ltr" ? (
							<ChevronRight color="secondary" />
						) : (
							<ChevronLeft color="secondary" />
						)}
					</IconButton>
					<IconButton onClick={handleLogout}>
						<ExitToApp color="secondary" />
					</IconButton>
				</div>
				<Divider />
				<List>
					{menuButtons.map((item) => (
						<ListItem
							button
							key={item.text}
							onClick={() => handleClick(item.route)}
							selected={history.location.pathname === item.route}
							className={classes.menuItem}
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItem>
					))}
				</List>
				<Divider />
				{userGroupButtons.length > 0 && (
					<>
						<List>
							<ListItem>
								<Typography>User groups</Typography>
							</ListItem>
							{userGroupButtons.map((item) => (
								<ListItem
									button
									key={item.text}
									onClick={() => handleClick(item.route)}
									selected={
										history.location.pathname === item.route
									}
									className={classes.menuItem}
								>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.text} />
								</ListItem>
							))}
						</List>
						<Divider />{" "}
					</>
				)}
				{authenticatedUser.admin && (
					<>
						<List>
							<ListItem>
								<Typography>Admin menu</Typography>
							</ListItem>
							{adminButtons.map((item) => (
								<ListItem
									button
									key={item.text}
									onClick={() => handleClick(item.route)}
									selected={
										history.location.pathname === item.route
									}
									className={classes.menuItem}
								>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.text} />
								</ListItem>
							))}
						</List>
						<Divider />
					</>
				)}
				<div className={classes.spacer}></div>
				<Divider />
				<ListItem>
					<Box display="flex" flexDirection="column">
						<Typography>{authenticatedUser.name}</Typography>
						{authenticatedUser.admin && (
							<Typography
								variant="body2"
								className={classes.halfOpacity}
							>
								<i>Administrator</i>
							</Typography>
						)}
						<Link
							style={{cursor: "pointer"}}
							color="secondary"
							onClick={handleChangePassword}
						>
							Change password/username
						</Link>
						<About />
					</Box>
				</ListItem>
			</Drawer>
			{sendResetEmailResult?.loading && (
				<Box position="absolute" style={{bottom: 10, left: 10}}>
					<CircularProgress color="primary" />
				</Box>
			)}
		</>
	);
}
