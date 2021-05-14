const resolvers = {
	Query: {
		groceriesByUserGroupId: async (
			root,
			{id},
			{models, loggedIn, user}
		) => {
			if (!loggedIn) return null;
			const userGroup = await models.UserGroup.findOne({
				where: {
					id,
				},
			});
			const users = await userGroup.getUsers();
			let match = false;
			users.forEach((tmp_user) => {
				if (tmp_user.get("id") === user.id) match = true;
			});
			if (!match) return null;
			return models.Grocery.findAll({
				where: {
					user_group_id: id,
				},
			});
		},
	},
	Mutation: {},
	Grocery: {
		groceryList: async (root, args, {models, loggedIn}) => {
			if (!loggedIn) return null;
			return await root.getGroceryList();
		},
	},
	GroceryList: {
		groceries: async (root, args, {models, loggedIn}) => {
			if (!loggedIn) return null;
			return await root.getGroceries();
		},
		userGroup: async (root, args, {models, loggedIn}) => {
			if (!loggedIn) return null;
			return await root.getUserGroup();
		},
	},
};

module.exports = resolvers;
