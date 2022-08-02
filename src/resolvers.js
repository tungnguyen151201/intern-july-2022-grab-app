const User = require('./models/User');

const resolvers = {
  Query: {

  },
  Mutation: {
    createUser: async (_, { userInput }) => {
      try {
        if (userInput.role === 'ADMIN' && (await User.find({ role: 'ADMIN' })).length > 0) {
          return {
            code: 403,
            success: false,
            message: 'Admin can be only created once',
            user: null,
          };
        }
        const user = await User.create((userInput.role === 'DRIVER') ? { ...userInput, isActive: false } : userInput);
        return {
          code: 200,
          success: true,
          message: 'Successfully created user',
          user,
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          user: null,
        };
      }
    },
  },
  User: {
    __resolveType(_, { role }) {
      return role;
    },
  },
};
module.exports = resolvers;
