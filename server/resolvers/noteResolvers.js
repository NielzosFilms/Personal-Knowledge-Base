const resolvers = {
	Query: {
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
	},
	Mutation: {
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
};

module.exports = resolvers;
