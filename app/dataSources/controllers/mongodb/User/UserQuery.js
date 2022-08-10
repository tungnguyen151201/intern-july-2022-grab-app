const { User } = require('../../../models');
const redis = require('../../redis');

async function getUserById(_args, context, _info) {
  const { userId } = context.signature;
  try {
    let user = await redis.getUserById(userId);
    if (!user) {
      user = await User.findById(userId);
      if (!user) {
        return { isSuccess: false, message: 'User not found' };
      }
      redis.saveUser(user);
    }
    return { ...user, id: userId };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getUserById,
};
