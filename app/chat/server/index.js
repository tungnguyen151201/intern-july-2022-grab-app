const { Server } = require('socket.io');
const { registerChatHandlers, registerErrorHandlers, registerConnectionHandlers } = require('./handlers');
const { ioMiddlewares } = require('./middlewares');

const io = new Server();
const onConnection = socket => {
  registerConnectionHandlers(socket);
  registerChatHandlers(io, socket);
  registerErrorHandlers(socket);
};

io.use(ioMiddlewares);
io.on('connection', onConnection);

module.exports = io;
