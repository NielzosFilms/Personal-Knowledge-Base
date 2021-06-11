const resolvers = {
    Query: {
        users: async (root, args, { models, loggedIn }) => {
            if (!loggedIn) return null;
            return models.User.findAll();
        },
        userById: async (root, { id, token }, { models, loggedIn }) => {
            if (token) {
                const emailToken = await models.EmailToken.findOne({
                    where: {
                        token,
                    },
                });
                if (!emailToken) {
                    return null;
                }
            } else {
                if (!loggedIn) return null;
            }
            return models.User.findOne({
                where: {
                    id,
                },
            });
        },
        userGroups: async (root, args, { models, loggedIn, user }) => {
            if (!loggedIn || !user.admin) return null;
            return models.UserGroup.findAll();
        },
        userGroupById: async (root, { id }, { models, loggedIn, user }) => {
            if (!loggedIn) return null;
            const group = await models.UserGroup.findOne({
                where: {
                    id,
                },
            });
            const group_users = await group.getUsers();
            if (
                group_users.find(
                    (grp_user) => grp_user.dataValues.id === user.id
                )
            ) {
                return group;
            }
            return null;
        },
    },
    Mutation: {
        createUser: async (root, { token, name, password }, { models }) => {
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
            { id, name, email, admin, password, token },
            { models, loggedIn, user }
        ) => {
            if (token) {
                const emailToken = await models.EmailToken.findOne({
                    where: {
                        token,
                    },
                });
                if (!emailToken) {
                    return null;
                } else {
                    emailToken.destroy();
                }
            } else {
                if (!loggedIn && !user.admin) return null;
            }
            await models.User.update(
                {
                    name,
                    email,
                    admin,
                    ...(password && { password }),
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
        deleteUser: async (root, { id }, { models, loggedIn, user }) => {
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
        updateUserGroup: async (root, { id, name }, { models }) => {
            // const db_lists = await models.GroceryList.findAll({
            // 	where: {
            // 		user_group_id: id,
            // 	},
            // });

            // db_lists.map(async (list) => {
            // 	const match = groceryLists.find((e) => e.id === list.id);
            // 	if (match) {
            // 		list.name = match.name;
            // 		list.save();
            // 		groceryLists.splice(groceryLists.indexOf(match), 1);
            // 	} else {
            // 		list.destroy();
            // 	}
            // });

            // await models.GroceryList.bulkCreate(groceryLists);

            await models.UserGroup.update(
                {
                    name,
                },
                {
                    where: {
                        id,
                    },
                }
            );
            return await models.UserGroup.findOne({
                where: {
                    id,
                },
            });
        },
    },
    User: {
        userGroups: async (root, args, { models, loggedIn }) => {
            if (!loggedIn) return null;
            return await root.getUserGroups();
        },
    },
    UserGroup: {
        users: async (root, args, { models, loggedIn }) => {
            if (!loggedIn) return null;
            return await root.getUsers();
        },
        groceryLists: async (root, args, { models, loggedIn }) => {
            if (!loggedIn) return null;
            return await root.getGroceryLists();
        },
    },
};

module.exports = resolvers;
