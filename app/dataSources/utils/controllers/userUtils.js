const _ = require('lodash');
const { User } = require('../../models');

function getFields(info) {
  const { selections } = info.fieldNodes[0].selectionSet;

  const fieldNames = _.map(selections, field => {
    if (field.name.value === 'id') return '_id';
    if (field.name.value === 'name') return 'firstName lastName';
    return field.name.value;
  });

  return fieldNames.join(' ');
}

async function getUsersByName(name, limit, cursor, fields) {
  const filters = { $text: { $search: name } };
  if (cursor) {
    filters._id = { $lt: cursor };
  }

  const users = await User.find(filters, fields)
    .sort({ _id: -1 })
    .limit(limit || 10)
    .lean();

  return users;
}

async function getUsersByUsername(username, limit, cursor, fields) {
  const filters = { username: { $regex: username } };
  if (cursor) {
    filters._id = { $lt: cursor };
  }

  const users = await User.find(filters, fields)
    .sort({ _id: -1 })
    .limit(limit || 10)
    .lean();

  return users;
}

async function getAllUsers(limit, cursor, fields) {
  let filters;
  if (cursor) {
    filters = { _id: { $lt: cursor } };
  }

  const users = await User.find(filters, fields)
    .sort({ _id: -1 })
    .limit(limit || 10)
    .lean();

  return users;
}

module.exports = {
  getFields,
  getUsersByName,
  getUsersByUsername,
  getAllUsers,
};
