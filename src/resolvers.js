const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('./models/User');

const SECRET_KEY = 'grab-authentication';

const resolvers = {
  Query: {
    me: async (_, __, { userId }) => {
      try {
        return await User.findById(userId);
      } catch (err) {
        console.log(err);
        return null;
      }
    },
  },
  Mutation: {
    signUp: async (_, { userInput }) => {
      const { username, password, role } = userInput;
      try {
        if (await User.findOne({ username })) {
          return {
            code: 400,
            success: false,
            message: 'Username invalid or already taken',
          };
        }
        if (role === 'Admin' && (await User.find({ role })).length > 0) {
          return {
            code: 403,
            success: false,
            message: 'Admin can be only created once',
          };
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.create(
          role === 'Driver'
            ? { ...userInput, password: hashedPassword, isActive: false }
            : { ...userInput, password: hashedPassword }
        );
        return {
          code: 200,
          success: true,
          message: 'Sign up successfully',
        };
      } catch (err) {
        return {
          code: 500,
          success: false,
          message: err,
        };
      }
    },
    login: async (_, { username, password }) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return {
            code: 404,
            success: false,
            message: 'User not found',
            token: null,
          };
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return {
            code: 404,
            success: false,
            message: 'Invalid password',
            token: null,
          };
        }
        if (user?.isActive === false) {
          return {
            code: 403,
            success: false,
            message: "This account haven't been activated yet",
            token: null,
          };
        }
        const token = jwt.sign({ userId: user.id }, SECRET_KEY);
        return {
          code: 200,
          success: true,
          message: 'Login successfully',
          token,
        };
      } catch (err) {
        return {
          code: 500,
          success: false,
          message: err,
          token: null,
        };
      }
    },
    activateDriver: async (_, { username, deactivate }, { userRole }) => {
      if (userRole !== 'Admin') {
        return {
          code: 403,
          success: false,
          message: 'You must be an Admin',
        };
      }
      const user = await User.findOne({ username });
      if (!user) {
        return {
          code: 404,
          success: false,
          message: 'User not found',
        };
      }
      if (user.role !== 'Driver') {
        return {
          code: 400,
          success: false,
          message: 'User must be a Driver',
        };
      }
      if (user.isActive !== deactivate) {
        return {
          code: 400,
          success: false,
          message: deactivate
            ? 'Driver has already been deactivated'
            : 'Driver has already been activated',
        };
      }
      await User.findByIdAndUpdate(user.id, { isActive: !deactivate });
      return {
        code: 200,
        success: true,
        message: deactivate
          ? 'Deactivate driver successfully'
          : 'Activate driver successfully',
      };
    },
  },
  User: {
    async __resolveType(_, { userRole }) {
      return userRole;
    },
  },
};
module.exports = resolvers;
