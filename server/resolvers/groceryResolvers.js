const resolvers = {
	Query: {
		groceryListById: async (root, {id}, {models, loggedIn, user}) => {
			if (!loggedIn) return null;
			const groceryList = await models.GroceryList.findByPk(id);
			const userGroup = await groceryList.getUserGroup();
			const groupUsers = await userGroup.getUsers();
			if (
				groupUsers.find(
					(grp_user) => grp_user.dataValues.id === user.id
				)
			) {
				return groceryList;
			}
			return null;
		},
	},
	Mutation: {
		createGroceryList: async (
			root,
			{name, user_group_id},
			{models, loggedIn, user}
		) => {
			if (!loggedIn || !user.admin) return null;
			const list = await models.GroceryList.create({
				name,
				user_group_id,
			});
			return await models.GroceryList.findByPk(list.id);
		},
		updateGroceryList: async (
			root,
			{id, name},
			{models, loggedIn, user}
		) => {
			if (!loggedIn || !user.admin) return null;
			await models.GroceryList.update(
				{
					name,
				},
				{
					where: {
						id,
					},
				}
			);
			return await models.GroceryList.findByPk(id);
		},
		deleteGroceryList: async (root, {id}, {models, loggedIn, user}) => {
			if (!loggedIn || !user.admin) return false;
			await models.Grocery.destroy({
				where: {
					grocery_list_id: id,
				},
			});
			await models.GroceryList.destroy({
				where: {
					id,
				},
			});
			return true;
		},
		createGrocery: async (
			root,
			{grocery_list_id, name, needed},
			{models, loggedIn, user}
		) => {
			if (!loggedIn) return null;
			const groceryList = await models.GroceryList.findByPk(
				grocery_list_id
			);
			const userGroup = await groceryList.getUserGroup();
			const groupUsers = await userGroup.getUsers();
			if (
				groupUsers.find(
					(grp_user) => grp_user.dataValues.id === user.id
				)
			) {
				const grocery = await models.Grocery.create({
					name,
					needed,
					grocery_list_id,
				});
				return await models.Grocery.findByPk(grocery.id);
			}
			return null;
		},
		updateGrocery: async (
			root,
			{id, name, needed},
			{models, loggedIn, user}
		) => {
			if (!loggedIn) return null;
			const grocery = await models.Grocery.findByPk(id);
			const groceryList = await grocery.getGroceryList();
			const userGroup = await groceryList.getUserGroup();
			const groupUsers = await userGroup.getUsers();
			if (
				groupUsers.find(
					(grp_user) => grp_user.dataValues.id === user.id
				)
			) {
				await models.Grocery.update(
					{
						name,
						needed,
					},
					{
						where: {
							id,
						},
					}
				);
				return await models.Grocery.findByPk(id);
			}
			return null;
		},
		deleteGrocery: async (
			root,
			{id, name, needed},
			{models, loggedIn, user}
		) => {
			if (!loggedIn) return false;
			const grocery = await models.Grocery.findByPk(id);
			const groceryList = await grocery.getGroceryList();
			const userGroup = await groceryList.getUserGroup();
			const groupUsers = await userGroup.getUsers();
			if (
				groupUsers.find(
					(grp_user) => grp_user.dataValues.id === user.id
				)
			) {
				await models.Grocery.destroy({
					where: {
						id,
					},
				});
				return true;
			}
			return false;
		},
	},
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
