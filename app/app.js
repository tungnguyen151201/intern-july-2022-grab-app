const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const express = require('express');
const http = require('http');
const typeDefs = require('./schemas');
const dataSources = require('./dataSources');
const resolvers = require('./resolvers');
const { checkQuery, createDataLoader, verifyToken } = require('./utils');
const chatServer = require('./chat/server');

const app = express();
const server = http.createServer(app);

chatServer.attach(server);

app.get('/chat', (__, res) => {
  res.sendFile(`${__dirname}/chat/client/index.html`);
});

async function createContext({ req }) {
  const request = checkQuery(req.body.query);
  if (request === 'passed') {
    return null;
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  const verifyResult = await verifyToken(token);

  if (!verifyResult.isSuccess) {
    throw new AuthenticationError(verifyResult.message);
  }

  return {
    signature: verifyResult.signature,
    token,
    dataloaders: createDataLoader(),
  };
}

(async () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: dataSources.controllers,
    context: createContext,
    introspection: process.env.NODE_ENV !== 'production',
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    path: '/',
  });
})();
module.exports = server;
