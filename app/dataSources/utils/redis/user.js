const { User } = require('../../models');
const redisClient = require('./clients');
const config = require('../../../config');

async function saveUserToCache(user) {
  const { firstName, lastName, userName, role } = user;
  await redisClient.setEx(
    user._id.toString(),
    config.jwt.expireTime,
    JSON.stringify({ firstName, lastName, userName, role }),
  );
}

async function getUserFromCache(userId) {
  let user = JSON.parse(await redisClient.get(userId));
  if (user) {
    return { _id: userId, ...user };
  }

  user = await User.findById(userId);
  if (!user) {
    return null;
  }
  saveUserToCache(user);
  return user;
}

module.exports = {
  getUserFromCache,
};
