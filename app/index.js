require('./global');

const app = require('./app');

(async function startApolloServer() {
  await app.listen({ port: 4000 });
  console.log(`
      🚀  Server is running
      🔉  Listening on port 4000
      📭  Query at http://localhost:4000
    `);
}());
