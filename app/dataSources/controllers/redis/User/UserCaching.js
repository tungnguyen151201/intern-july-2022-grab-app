const { get, set } = require('../GenericCommands');
const config = require('../../../../config');

async function getUserById(userId) {
  const user = JSON.parse(await get(userId));
  if (!user) {
    return null;
  }
  return { userId, ...user };
}

function saveUser(user) {
  const { firstName, lastName, username, role, isActive } = user;
  set(
    user._id.toString(),
    JSON.stringify({ firstName, lastName, username, role, isActive }),
    Math.floor(Date.now() / 1000) + config.jwt.expireTime,
  );
}
module.exports = {
  getUserById,
  saveUser,
};
