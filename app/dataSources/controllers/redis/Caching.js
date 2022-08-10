const redis = require('./GenericCommands');
const config = require('../../../config');

async function getUserById(userId) {
  const user = JSON.parse(await redis.get(userId));
  return user;
}

function saveUser(user) {
  redis.set(user._id.toString(), JSON.stringify(user), Math.floor(Date.now() / 1000) + config.jwt.expireTime);
}
module.exports = {
  getUserById,
  saveUser,
};
