const { ApolloServer, AuthenticationError } = require('apollo-server-express');

// TODO import express.js
const jwt = require('jsonwebtoken');
const typeDefs = require('./schemas');
const dataSources = require('./dataSources');
const resolvers = require('./resolvers');
const config = require('./config');
const express = require('express');
const checkQuery = require('./utils/checkQuery');

const app = express();

async function verifyToken(token) {
  if (!token) {
    return { isSuccess: false, message: 'invalid token' };
  }

  // FIXME verify JWT
  const { userId } = jwt.verify(token, config.jwt.secretKey);

  const user = await dataSources.models.User.findById(userId);
  if (!user) {
    return { isSuccess: false, message: 'User not found'};
  }

  // TODO create signature
  const signature = { userId: user.id, userRole: user.role };
  return { isSuccess: true, signature };
}

async function createContext({ req }) {
  const {status, message} = checkQuery(req.body.query);

  if (status === 'error') {
    throw new Error(message);
  }
  if (status === 'skip') {
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

async function startApolloExpressServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: dataSources.controllers,
    context: createContext,
  });
  await server.start();
  server.applyMiddleware({
    app,
    path: '/',
  });
}
startApolloExpressServer();
module.exports = app;
