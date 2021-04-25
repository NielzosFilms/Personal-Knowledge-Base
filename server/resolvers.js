const resolvers = {
  Query: {
    hello: () => "Hello World",
    users: async (root, args, { models }) => {
      return models.User.findAll();
    },
  },
};

module.exports = resolvers;
