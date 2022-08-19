const { User } = require('../models');

async function batchUsersById(keys) {
  const userIds = keys;

  const users = await User.find({
    _id: { $in: userIds },
  }).lean();

  return userIds.map(userId => users.find(user => user._id.toString() === userId));
}

module.exports = {
  batchUsersById,
};
