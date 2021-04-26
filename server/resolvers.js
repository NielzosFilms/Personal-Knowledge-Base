const passwordHash = require("password-hash");
const crypto = require("crypto");

const resolvers = {
    Query: {
        hello: (root, args, { models, loggedIn, user }) => {
            if (!loggedIn) return null;
            return `Hello ${user.name}`;
        },
        login: async (root, { username, password }, { models, loggedIn }) => {
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
                    return { success: true, token };
                }
            }
            return {
                success: false,
                token: null,
            };
        },
        logout: async (root, args, { models, loggedIn, user, token }) => {
            if (!loggedIn || !user || !token) return false;
            await models.Session.destroy({
                where: {
                    token,
                },
            });
            return true;
        },
        isAuthenticated: async (root, args, { loggedIn }) => {
            return loggedIn;
        },
        getAuthenticatedUser: async (root, args, { loggedIn, user }) => {
            if (!loggedIn) return null;
            return user;
        },
        users: async (root, args, { models, loggedIn }) => {
            if (!loggedIn) return null;
            return models.User.findAll();
        },
        notes: async (root, args, { models, loggedIn, user }) => {
            if (!loggedIn) return null;
            return models.Note.findAll();
        },
    },
    Note: {
        user: async (root, args, { models, loggedIn, user }) => {
            if (!loggedIn) return null;
            return await models.User.findOne({
                where: {
                    id: root.dataValues.user_id,
                },
            });
        },
    },
};

module.exports = resolvers;
