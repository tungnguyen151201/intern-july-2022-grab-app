const { User } = require('../../models');

async function getUserById(_args, context, _info) {
  const { userId } = context.signature;
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getUserById,
};
