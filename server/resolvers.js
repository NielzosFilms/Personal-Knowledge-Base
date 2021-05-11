const passwordHash = require("password-hash");
const crypto = require("crypto");
const {GraphQLDateTime} = require("graphql-iso-date");
const sequelize = require("sequelize");
const {Op} = sequelize;

const nodemailer = require("nodemailer");

const transport = {
	host: "smtp.gmail.com",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
};

const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
	if (error) {
		console.log(error);
	} else {
		console.log("Nodemailer connected!");
	}
});

const resolvers = {
	Date: GraphQLDateTime,
	Query: {
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
		userById: async (root, {id}, {models, loggedIn}) => {
			if (!loggedIn) return null;
			return models.User.findOne({
				where: {
					id,
				},
			});
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
			if (id) {
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
		createUser: async (root, {name, email, password}, {models}) => {
			// const user = await models.User.create({
			// 	name,
			// 	email,
			// 	admin: false,
			// 	password,
			// });
			// await user.save();

			// const root_folder = await models.Folder.create({
			// 	name: "Notes",
			// 	ancestry: "root/",
			// 	user_id: Number(user.id),
			// });
			// await root_folder.save();

			transporter
				.sendMail({
					from: "NielzosFilms Knowledge Base",
					to: email,
					subject: "Confirm email address to create your account!",

					html: "this is the body of the message",
				})
				.catch((error) => console.log(error));

			return null;
		},
		updateUser: async (
			root,
			{id, name, email, admin},
			{models, loggedIn, user}
		) => {
			if (!loggedIn && !user.admin) return null;
			await models.User.update(
				{
					name,
					email,
					admin,
				},
				{
					where: {
						id,
					},
				}
			);
			return await models.User.findOne({
				where: {
					id,
				},
			});
		},
		deleteUser: async (root, {id}, {models, loggedIn, user}) => {
			if (!loggedIn && !user.admin) return false;

			await models.Note.destroy({
				where: {
					user_id: id,
				},
			});

			await models.Folder.destroy({
				where: {
					user_id: id,
				},
			});

			await models.Session.destroy({
				where: {
					user_id: id,
				},
			});

			await models.User.destroy({
				where: {
					id,
				},
			});
			return true;
		},
		createNote: async (
			root,
			{filename, content, folderId},
			{models, loggedIn, user}
		) => {
			if (!loggedIn) return null;
			let folder;
			if (folderId) {
				folder = await models.Folder.findOne({
					where: {
						id: folderId,
						user_id: Number(user.id),
					},
				});
			} else {
				folder = await models.Folder.findOne({
					where: {
						ancestry: "root/",
						user_id: Number(user.id),
					},
				});
			}
			const note = await models.Note.create({
				filename,
				content,
				folder_id: Number(folder.id),
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
					user_id: Number(user.id),
				},
			});
			return true;
		},
		createFolder: async (
			root,
			{ancestry, name},
			{models, loggedIn, user}
		) => {
			if (!loggedIn) return false;
			const folder = await models.Folder.create({
				ancestry,
				name,
				user_id: Number(user.id),
			});
			await folder.save();
			return folder;
		},
		updateFolder: async (
			root,
			{id, ancestry, name},
			{models, loggedIn, user}
		) => {
			if (!loggedIn) return false;
			await models.Folder.update(
				{
					...(ancestry && {ancestry}),
					...(name && {name}),
				},
				{
					where: {
						id,
						user_id: Number(user.id),
					},
				}
			);
			return await models.Folder.findOne({
				where: {
					id,
					user_id: Number(user.id),
				},
			});
		},
		deleteFolder: async (root, {id}, {models, loggedIn, user}) => {
			if (!loggedIn) return false;
			const folder_rm = await models.Folder.findOne({
				where: {
					id,
					user_id: Number(user.id),
				},
			});

			const sub_folders = await models.Folder.findAll({
				where: {
					ancestry: {
						[sequelize.Op.substring]: `${folder_rm.ancestry}${id}/`,
					},
					user_id: Number(user.id),
				},
			});

			let sub_folder_ids = [id];
			sub_folders.map(async (sub_folder) => {
				sub_folder_ids.push(sub_folder.id);
			});
			await models.Note.destroy({
				where: {
					folder_id: sub_folder_ids,
					user_id: Number(user.id),
				},
			});

			await models.Folder.destroy({
				where: {
					ancestry: {
						[sequelize.Op.substring]: `${folder_rm.ancestry}${id}/`,
					},
					user_id: Number(user.id),
				},
			});

			await models.Folder.destroy({
				where: {
					id,
					user_id: Number(user.id),
				},
			});
			return true;
		},
	},
};

module.exports = resolvers;
