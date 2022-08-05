const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const User = require('./models/User');
require('dotenv').config();

const password = '141517';
const SECRET_KEY = 'grab-authentication';

async function connectDB() {
  try {
    await mongoose.connect(
      `mongodb+srv://huytung:${password}@cluster0.szpdftl.mongodb.net/?retryWrites=true&w=majority`,
      {
        dbName: 'graphql',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log('Database connected!');
  } catch (err) {
    throw new Error(err);
  }
}

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
