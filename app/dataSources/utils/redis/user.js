const { User } = require('../../models');
const redisClient = require('./clients');

async function getUserFromCache(userId) {
  let user = await redisClient.getUserById(userId);
  if (user) {
    return user;
  }

  user = await User.findById(userId);
  if (!user) {
    return null;
  }
  redisClient.saveUser(user);
  return user;
}

module.exports = {
  getUserFromCache,
};
