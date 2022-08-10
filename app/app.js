const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const express = require('express');
const jwt = require('jsonwebtoken');
const typeDefs = require('./schemas');
const dataSources = require('./dataSources');
const resolvers = require('./resolvers');
const config = require('./config');
const { checkQuery } = require('./utils');

const app = express();

async function verifyToken(token) {
  // Check invalid token
  if (!token) {
    return { isSuccess: false, message: 'Invalid token' };
  }

  // Check token rejected
  const inBlackList = await dataSources.redis.getBlockedToken(token);
  if (inBlackList) {
    return { isSuccess: false, message: 'Token rejected' };
  }

  const { userId, exp } = jwt.verify(token, config.jwt.secretKey);

  // Caching
  let user = await dataSources.redis.getUserById(userId);
  if (!user) {
    user = await dataSources.models.User.findById(userId);
    if (!user) {
      return { isSuccess: false, message: 'User not found' };
    }
    dataSources.redis.saveUser(user);
  }

  // Check if user is active
  if (user?.isActive === false) {
    dataSources.redis.setBlockedToken(token, exp);
    return { isSuccess: false, message: 'Token rejected' };
  }

  const signature = { userId, userRole: user.role };
  return { isSuccess: true, signature };
}

async function createContext({ req }) {
  const isPassed = checkQuery(req.body.query);

  if (isPassed) {
    return null;
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  const verifyResult = await verifyToken(token);

  if (!verifyResult.isSuccess) {
    throw new AuthenticationError(verifyResult.message);
  }

  return {
    signature: verifyResult.signature,
  };
}

(async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: dataSources.controllers,
    context: createContext,
    introspection: process.env.NODE_ENV !== 'production',
  });
  await server.start();
  server.applyMiddleware({
    app,
    path: '/',
  });
})();

module.exports = app;
