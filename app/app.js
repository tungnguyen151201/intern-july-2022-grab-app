const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const express = require('express');
const jwt = require('jsonwebtoken');
const typeDefs = require('./schemas');
const dataSources = require('./dataSources');
const resolvers = require('./resolvers');
const config = require('./config');
const { checkQuery } = require('./utils');

const {
  getBlockedToken,
  setBlockedToken,
  getUserFromCache,
} = dataSources.redisUtils;

const app = express();

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
    setBlockedToken(token, exp);
    return { isSuccess: false, message: 'Token rejected' };
  }

  const signature = { userId, userRole: user.role };
  return { isSuccess: true, signature };
}

function logout(token) {
  if (!token) {
    return { isSuccess: false, message: 'Invalid token' };
  }

  const { exp } = jwt.verify(token, config.jwt.secretKey);
  setBlockedToken(token, exp);

  return { isSuccess: true, message: 'Logged out' };
}

async function createContext({ req }) {
  const request = checkQuery(req.body.query);

  if (request === 'passed') {
    return null;
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (request === 'logout') {
    return logout(token);
  }

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
