require('./global');
const app = require('./app');

const { url, port } = await app.listen({ port: 4000 });
console.log(`
      🚀  Server is running
      🔉  Listening on port ${port}
      📭  Query at ${url}
    `);
