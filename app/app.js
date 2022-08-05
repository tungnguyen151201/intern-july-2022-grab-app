const { ApolloServer, AuthenticationError } = require('apollo-server-express');

// TODO import express.js
const jwt = require('jsonwebtoken');
const typeDefs = require('./schemas');
const dataSources = require('./dataSources');
const resolvers = require('./resolvers');
const config = require('./config');
const express = require('express');

const app = express();

async function verifyToken(token) {
  if (!token) {
    return { isSuccess: false, message: 'invalid token' };
  }

  // FIXME verify JWT
  const { userId } = jwt.verify(token, config.jwt.secretKey);

  const user = await dataSources.models.User.findById(userId);

  // TODO create signature
  const signature = { userId, userRole: user.role };
  return { isSuccess: true, signature };
}

async function createContext({ req }) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const verifyResult = await verifyToken(token);

  if (!verifyResult.isSuccess) {
    throw AuthenticationError(verifyResult.message);
  }

  return {
    signature: verifyResult.signature,
  };
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: dataSources.controllers,
  context: createContext,
});
server.applyMiddleware({
  app,
  path: '/',
});

module.exports = server;
