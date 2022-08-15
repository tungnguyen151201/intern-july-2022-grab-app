const { User } = require('../../models');

async function getMe(__, context) {
  const { userId } = context.signature;
  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw new Error(error);
  }
}
async function getUsersWithCriteria(args, context) {
  const { userRole } = context.signature;
  if (userRole !== 'Admin') {
    return null;
  }
  try {
    const users = await User.find(args.criteria).lean();
    return users;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getMe,
  getUsersWithCriteria,
};
