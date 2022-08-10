const redis = require('redis');

// TODO create only 1 connect
// hash jwt before set redis
async function connectRedis() {
  const redisClient = redis.createClient();
  try {
    await redisClient.connect();
  } catch (error) {
    throw new Error(error);
  }
  return redisClient;
}

async function getBlockedToken(token) {
  try {
    const redisClient = await connectRedis();
    const result = await redisClient.get(`bl_${token}`);
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

async function setBlockedToken(token, keyExp) {
  if (!token) {
    return;
  }
  try {
    const redisClient = await connectRedis();
    await redisClient.set(`bl_${token}`, 'value');
    if (keyExp) {
      redisClient.expireAt(`bl_${token}`, keyExp);
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function getToken(key) {
  try {
    const redisClient = await connectRedis();
    const token = await redisClient.get(key);
    return token;
  } catch (error) {
    throw new Error(error);
  }
}
async function setToken(key, value, keyExp) {
  if (!key || !value) {
    return;
  }
  try {
    const redisClient = await connectRedis();
    await redisClient.set(key, value);
    if (keyExp) {
      redisClient.expireAt(key, keyExp);
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function getExpireTime(key) {
  if (!key) {
    return null;
  }
  try {
    const redisClient = await connectRedis();
    const result = await redisClient.expireTime(key);
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

async function delKey(key) {
  if (!key) {}
}

module.exports = {
  getBlockedToken,
  setBlockedToken,
  getToken,
  setToken,
  getExpireTime,
};
