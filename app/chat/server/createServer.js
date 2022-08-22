const { Server } = require('socket.io');
const { verifyToken } = require('../../utils');
const { getUserFromCache } = require('../../dataSources/utils/redis');
const { Room } = require('../../dataSources/models');

function createChatServer(server) {
  const io = new Server(server);

  io.use(async (socket, next) => {
    try {
      const { token } = socket.handshake.auth;
      const verifyResult = await verifyToken(token);

      if (!verifyResult.isSuccess) {
        next(new Error('Invalid Credentials!'));
        return;
      }
      socket.signature = verifyResult.signature;

      next();
    } catch (error) {
      next(error);
    }
  });

  io.on('connection', async socket => {
    let room;
    try {
      const { userId } = socket.signature;
      const { firstName, lastName } = await getUserFromCache(userId);
      const fullname = `${lastName} ${firstName}`;
      socket.on('join-room', async roomId => {
        if (!roomId) {
          socket.emit('handle-error', 'Room not found');
          return;
        }
        const roomDb = await Room.findById(roomId).lean();

        if (!roomDb) {
          socket.emit('handle-error', 'Room not found');
          return;
        }

        if (roomDb.user1.toString() !== userId && roomDb.user2.toString() !== userId) {
          socket.emit('handle-error', 'Invalid Credentials!');
          return;
        }

        socket.join(roomId);

        io.to(roomId).emit('join-room', { user: fullname, msg: 'joined room' });
        room = roomId;
      });

      socket.on('chat-message', ({ msg }) => {
        if (!room) {
          return;
        }

        io.to(room).emit('chat-message', { user: fullname, msg });
      });

      socket.on('disconnect', () => {
        if (!room) {
          return;
        }
        socket.leave(room);
        io.to(room).emit('chat-message', { user: fullname, msg: 'left room' });
      });
    } catch (error) {
      socket.emit('handle-error', error);
    }
  });
}

module.exports = createChatServer;
