const { User } = require('../models');

async function batchUsersById(keys) {
  const userIds = keys.map(key => JSON.parse(key).userId);
  const { fields } = JSON.parse(keys[0]);

  const users = await User.find(
    {
      _id: { $in: userIds },
    },
    fields,
  ).lean();

  return userIds.map(userId => users.find(user => user._id.toString() === userId));
}

module.exports = {
  batchUsersById,
};
