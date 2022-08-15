module.exports = {
  jwt: {
    secretKey: process.env.SECRET_KEY,
    expireTime: 5000,
    hashAlogrithm: 'sha256',
  },
};
