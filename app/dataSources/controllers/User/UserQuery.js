const { User } = require('../../models');
const {
  getFields,
  getUsersByName,
  getUsersByUsername,
  getAllUsers,
} = require('../../utils');

async function getMe(__, context) {
  try {
    const { userId } = context.signature;
    const user = await User.findById(userId).lean();
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

async function getUsers(args, context, info) {
  try {
    const { userRole } = context.signature;
    if (userRole !== 'Admin') {
      return null;
    }

    const { criteria, limit, cursor } = args;
    const { username, name } = criteria;
    const fields = getFields(info, 'getUsers');

    if (name) {
      return getUsersByName(name, limit, cursor, fields);
    }

    if (username) {
      return getUsersByUsername(username, limit, cursor, fields);
    }

    return getAllUsers(limit, cursor, fields);
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getMe,
  getUsers,
};
