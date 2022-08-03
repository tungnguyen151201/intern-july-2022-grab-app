/* eslint-disable no-console */
/* eslint-disable no-shadow */
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const User = require('./models/User');
require('dotenv').config();

const password = '141517';
const SECRET_KEY = 'grab-authentication';
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
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      if (!authHeader) {
        return null;
      }
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        return null;
      }
      try {
        const { userId } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(userId);
        return { userId, userRole: user.role };
      } catch (err) {
        return null;
      }
    },
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
