const _ = require('lodash');
const { User } = require('../models');

async function batchUsersById(keys) {
  const userIds = keys.map(key => JSON.parse(key).userId);
  let fields = keys.map(key => JSON.parse(key).fields);
  fields = _.uniq(fields).join(' ');
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
