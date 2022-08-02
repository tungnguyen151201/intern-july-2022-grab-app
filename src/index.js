/* eslint-disable no-shadow */
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
require('dotenv').config();

const password = '141517';
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://huytung:${password}@cluster0.szpdftl.mongodb.net/graphql?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log('Database connected!');
  } catch (err) {
    console.log('Failed to connect to database', err);
  }
};

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url, port } = await server.listen({ port: 4000 });
  console.log(`
      🚀  Server is running
      🔉  Listening on port ${port}
      📭  Query at ${url}
    `);
}

connectDB();
startApolloServer(typeDefs, resolvers);
