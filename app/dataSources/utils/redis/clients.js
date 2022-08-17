const redis = require('redis');

const redisClient = redis.createClient();

(async () => {
  await redisClient.connect();
})();

redisClient.on('ready', () => {
  logger.info('connected to redis');
});

redisClient.on('error', error => {
  logger.error('redis error', error);
});

module.exports = redisClient;
