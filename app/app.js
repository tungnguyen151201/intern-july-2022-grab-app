const { ApolloServer, AuthenticationError } = require('apollo-server');

// TODO import express.js

const typeDefs = require('./schemas');
const dataSources = require('./dataSources');
const resolvers = require('./resolvers');

async function verifyToken(token) {
  if (!token) {
    return { isSuccess: false, message: 'invalid token' };
  }

  // FIXME verify JWT
  const { userId } = jwt.verify(token, SECRET_KEY);

  const user = await User.findById(userId);

  // TODO create signature
  const signature = { userId, userRole: user.role };
  return { isSuccess: true, signature };
}

async function createContext(req) {
  const token = req.headers.authorization?.replace('Bearer', '');
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

module.exports = server;
