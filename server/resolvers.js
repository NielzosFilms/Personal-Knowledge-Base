const passwordHash = require("password-hash");
const crypto = require("crypto");
const {GraphQLDateTime} = require("graphql-iso-date");
const sequelize = require("sequelize");
const {Op} = sequelize;

const resolvers = {
	Date: GraphQLDateTime,
	Query: {
		hello: (root, args, {models, loggedIn, user}) => {
			if (!loggedIn) return null;
			return `Hello ${user.name}`;
		},
		login: async (root, {username, password}, {models, loggedIn}) => {
			if (loggedIn) return {success: false, token: null};
			const user = await models.User.findOne({
				where: {
					name: username,
				},
			});

			if (user) {
				if (passwordHash.verify(password, user.password)) {
					const token = crypto.randomBytes(64).toString("hex");
					const session = await models.Session.create({
						token,
						user_id: Number(user.id),
					});
					session.save();
					return {success: true, token};
				}
			}
			return {
				success: false,
				token: null,
			};
		},
		logout: async (root, args, {models, loggedIn, user, token}) => {
			if (!loggedIn || !user || !token) return false;
			await models.Session.destroy({
				where: {
					token,
				},
			});
			return true;
		},
		isAuthenticated: async (root, args, {loggedIn}) => {
			return loggedIn;
		},
		getAuthenticatedUser: async (root, args, {loggedIn, user}) => {
			if (!loggedIn) return null;
			return user;
		},
		users: async (root, args, {models, loggedIn}) => {
			if (!loggedIn) return null;
			return models.User.findAll();
		},
		notes: async (root, {search}, {models, loggedIn, user}) => {
			if (!loggedIn) return null;
			return models.Note.findAll({
				where: {
					...(search && {
						filename: {
							[sequelize.Op.substring]: search,
						},
					}),
					user_id: user.id,
				},
			});
		},
		noteById: async (root, {id}, {models, loggedIn, user}) => {
			if (!loggedIn) return null;
			return models.Note.findOne({
				where: {
					id,
					user_id: user.id,
				},
			});
		},
		noteWithIds: async (root, {ids}, {models, loggedIn, user}) => {
			if (!loggedIn) return null;
			if (ids.length <= 0) return null;
			const ord = [sequelize.literal(`field(id, ${ids})`)];
			let notes = await models.Note.findAll({
				where: {
					id: ids,
					user_id: user.id,
				},
				order: ord,
			});
			return notes;
		},
		folders: async (root, {ancestry}, {models, loggedIn, user}) => {
			if (!loggedIn) return null;
			return models.Folder.findAll({
				where: {
					...(ancestry && {ancestry}),
					user_id: Number(user.id),
				},
			});
		},
		folderByIdOrRoot: async (root, {id}, {models, loggedIn, user}) => {
			if (!loggedIn) return null;
			if (id && id !== "root") {
				return models.Folder.findOne({
					where: {
						id,
						user_id: Number(user.id),
					},
				});
			} else {
				return models.Folder.findOne({
					where: {
						ancestry: "root/",
						user_id: Number(user.id),
					},
				});
			}
		},
		folderByAncestry: async (
			root,
			{ancestry},
			{models, loggedIn, user}
		) => {
			if (!loggedIn) return null;
			return models.Folder.findOne({
				where: {
					ancestry,
					user_id: Number(user.id),
				},
			});
		},
	},
	Note: {
		user: async (root, args, {models, loggedIn, user}) => {
			if (!loggedIn) return null;
			return await models.User.findOne({
				where: {
					id: root.dataValues.user_id,
				},
			});
		},
		folder: async (root, args, {models, loggedIn, user}) => {
			if (!loggedIn) return null;
			return await models.Folder.findOne({
				where: {
					id: root.dataValues.folder_id,
					user_id: Number(user.id),
				},
			});
		},
	},
	Folder: {
		user: async (root, args, {models, loggedIn, user}) => {
			if (!loggedIn) return null;
			return await models.User.findOne({
				where: {
					id: root.dataValues.user_id,
				},
			});
		},
		notes: async (root, args, {models, loggedIn, user}) => {
			if (!loggedIn) return null;
			return await models.Note.findAll({
				where: {
					folder_id: root.dataValues.id,
					user_id: Number(user.id),
				},
			});
		},
		subFolders: async (root, args, {models, loggedIn, user}) => {
			if (!loggedIn) return null;
			return await models.Folder.findAll({
				where: {
					ancestry: `${root.dataValues.ancestry}${root.dataValues.id}/`,
					user_id: Number(user.id),
				},
			});
		},
	},
	Mutation: {
		createNote: async (
			root,
			{filename, content},
			{models, loggedIn, user}
		) => {
			if (!loggedIn) return null;
			const root_folder = await models.Folder.findOne({
				where: {
					ancestry: "root/",
					user_id: Number(user.id),
				},
			});
			const note = await models.Note.create({
				filename,
				content,
				folder_id: Number(root_folder.id),
				user_id: Number(user.id),
			});
			await note.save();
			return note;
		},
		updateNote: async (
			root,
			{id, filename, content},
			{models, loggedIn, user}
		) => {
			if (!loggedIn) return null;
			await models.Note.update(
				{
					filename,
					content,
				},
				{
					where: {
						id,
						user_id: Number(user.id),
					},
				}
			);
			return await models.Note.findOne({
				where: {
					id,
					user_id: Number(user.id),
				},
			});
		},
		deleteNote: async (root, {id}, {models, loggedIn, user}) => {
			if (!loggedIn) return false;
			await models.Note.destroy({
				where: {
					id,
					user_id: user.id,
				},
			});
			return true;
		},
	},
};

module.exports = resolvers;
