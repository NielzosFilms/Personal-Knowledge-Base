const resolvers = {
	Query: {
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
	},
	Mutation: {
		createUser: async (root, {token, name, password}, {models}) => {
			const emailToken = await models.EmailToken.findOne({
				where: {
					token,
				},
			});
			if (emailToken) {
				const user = await models.User.create({
					name,
					email: emailToken.email,
					admin: false,
					password,
				});
				await user.save();

				const root_folder = await models.Folder.create({
					name: "Notes",
					ancestry: "root/",
					user_id: Number(user.id),
				});
				await root_folder.save();

				await models.EmailToken.destroy({
					where: {
						token,
					},
				});
				return user;
			}
			throw new Error("Email token not found.");
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
	},
};

module.exports = resolvers;
