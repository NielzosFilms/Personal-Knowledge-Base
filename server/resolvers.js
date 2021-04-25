const resolvers = {
  Query: {
    hello: () => "Hello World",
    users: async (root, args, { models, loggedIn }) => {
      if (!loggedIn) return null;
      return models.User.findAll();
    },
  },
};

module.exports = resolvers;
