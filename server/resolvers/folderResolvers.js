const resolvers = {
    Query: {
        folders: async (root, { ancestry }, { models, loggedIn, user }) => {
            if (!loggedIn) return null;
            return models.Folder.findAll({
                where: {
                    ...(ancestry && { ancestry }),
                    user_id: Number(user.id),
                },
                order: [["name", "ASC"]],
            });
        },
        folderByIdOrRoot: async (root, { id }, { models, loggedIn, user }) => {
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
            { ancestry },
            { models, loggedIn, user }
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
    Mutation: {
        createFolder: async (
            root,
            { ancestry, name },
            { models, loggedIn, user }
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
            { id, ancestry, name },
            { models, loggedIn, user }
        ) => {
            if (!loggedIn) return false;
            await models.Folder.update(
                {
                    ...(ancestry && { ancestry }),
                    ...(name && { name }),
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
        deleteFolder: async (root, { id }, { models, loggedIn, user }) => {
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
    Folder: {
        user: async (root, args, { models, loggedIn, user }) => {
            if (!loggedIn) return null;
            return await models.User.findOne({
                where: {
                    id: root.dataValues.user_id,
                },
            });
        },
        notes: async (root, args, { models, loggedIn, user }) => {
            if (!loggedIn) return null;
            return await models.Note.findAll({
                where: {
                    folder_id: root.dataValues.id,
                    user_id: Number(user.id),
                },
                order: [["filename", "ASC"]],
            });
        },
        subFolders: async (root, args, { models, loggedIn, user }) => {
            if (!loggedIn) return null;
            return await models.Folder.findAll({
                where: {
                    ancestry: `${root.dataValues.ancestry}${root.dataValues.id}/`,
                    user_id: Number(user.id),
                },
                order: [["name", "ASC"]],
            });
        },
        ancestryResolved: async (root, args, { models, loggedIn, user }) => {
            if (!loggedIn) return null;
            const ancestry_split = root.dataValues.ancestry
                .split("root/")
                .pop()
                .split("/");
            ancestry_split.push(`${root.dataValues.id}`);

            const folders = await models.Folder.findAll({
                where: {
                    id: ancestry_split,
                },
            });

            let ancestry = "";
            folders.forEach((folder) => {
                ancestry += `${folder.name}/`;
            });

            return ancestry;
        },
    },
};

module.exports = resolvers;
