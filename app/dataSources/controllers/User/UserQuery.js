const { User } = require('../../models');
const {
  getFields,
  getUsersByName,
  getUsersByUsername,
  getAllUsers,
} = require('../../utils');

async function getMe(__, context, info) {
  try {
    const { userId } = context.signature;
    const fields = getFields(info);
    const user = await User.findById(userId, fields).lean();
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    logger.error('UserQuery - getMe error:', error);
    throw error;
  }
}

async function getUsers(args, context, info) {
  try {
    const { userRole } = context.signature;
    if (userRole !== 'Admin') {
      return null;
    }

    const { criteria, limit, cursor } = args;
    const fields = getFields(info);

    if (!criteria) {
      return getAllUsers(limit, cursor, fields);
    }

    const { username, name } = criteria;

    if (name) {
      return getUsersByName(name, limit, cursor, fields);
    }

    if (username) {
      return getUsersByUsername(username, limit, cursor, fields);
    }

    return getAllUsers(limit, cursor, fields);
  } catch (error) {
    logger.error('UserQuery - getUsers error:', error);
    throw error;
  }
}

module.exports = {
  getMe,
  getUsers,
};
