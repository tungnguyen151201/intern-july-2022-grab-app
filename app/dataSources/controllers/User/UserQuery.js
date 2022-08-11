const { User } = require('../../models');

async function getUserById(_args, context, _info) {
  const { userId } = context.signature;
  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return { isSuccess: false, message: 'User not found' };
    }

    return { ...user, id: userId };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getUserById,
};
