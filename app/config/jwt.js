module.exports = {
  jwt: {
    secretKey: process.env.SECRET_KEY,
    expireTime: 300,
    hashAlogrithm: 'sha256',
  },
};
