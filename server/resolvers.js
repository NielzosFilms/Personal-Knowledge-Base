const passwordHash = require("password-hash");
const crypto = require("crypto");

const resolvers = {
  Query: {
    hello: (root, args, { models, loggedIn }) => {
      if (!loggedIn) return null;
      return "Hello World";
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
      return { success: false, token: null };
    },
    users: async (root, args, { models, loggedIn }) => {
      if (!loggedIn) return null;
      return models.User.findAll();
    },
  },
};

module.exports = resolvers;
