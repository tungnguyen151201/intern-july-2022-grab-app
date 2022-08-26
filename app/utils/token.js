const jwt = require('jsonwebtoken');
const dataSources = require('../dataSources');
const config = require('../config');

const { getBlockedToken, setBlockedToken, getUserFromCache } = dataSources.redisUtils;

async function verifyToken(token) {
  // Check invalid token
  if (!token) {
    return { isSuccess: false, message: 'Invalid token' };
  }

  // Check token rejected
  const inBlackList = await getBlockedToken(token);
  if (inBlackList) {
    return { isSuccess: false, message: 'Token rejected' };
  }

  const { userId, exp } = jwt.verify(token, config.jwt.secretKey);

  // Caching
  const user = await getUserFromCache(userId);
  if (!user) {
    return { isSuccess: false, message: 'User not found' };
  }

  // Check if user is active
  if (user.status === 'Deactivated') {
    await setBlockedToken(token, exp);
    return { isSuccess: false, message: 'Token rejected' };
  }

  const signature = { userId, userRole: user.role, fullname: `${user.lastName} ${user.firstName}` };
  return { isSuccess: true, signature };
}

module.exports = verifyToken;
