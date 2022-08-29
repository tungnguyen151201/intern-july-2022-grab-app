const { Room, Trip } = require('../../../dataSources/models');

module.exports = async (io, socket) => {
  const { userId, fullname } = socket.signature;

  let room;
  async function joinRoom(roomId) {
    try {
      if (!roomId) {
        socket.emit('handle-error', 'Invalid room!');
        socket.disconnect(true);
        return;
      }

      const roomDb = await Room.findById(roomId, 'users trip').lean();
      if (!roomDb) {
        socket.emit('handle-error', 'Invalid room!');
        socket.disconnect(true);
        return;
      }

      const { users, trip } = roomDb;

      const tripDb = await Trip.findById(trip, 'status').lean();
      if (tripDb?.status !== 'Accepted' && tripDb?.status !== 'Driving') {
        socket.emit('handle-error', 'Invalid room!');
        socket.disconnect(true);
        return;
      }

      const userIds = users.map(user => user.toString());
      if (!userIds.includes(userId)) {
        socket.emit('handle-error', 'Invalid Credentials!');
        socket.disconnect(true);
        return;
      }

      socket.join(roomId);

      io.to(roomId).emit('join-room', {
        user: fullname,
        message: 'joined room',
      });
      room = roomId;
    } catch (error) {
      logger.error('chatHandler - joinRoom error', error);
      socket.emit('handle-error', error.message);
      socket.disconnect(true);
    }
  }

  async function chatMessage(message) {
    try {
      if (!room) {
        socket.emit('handle-error', 'Join room to chat!');
        socket.disconnect(true);
        return;
      }

      io.to(room).emit('chat-message', { user: fullname, message });

      await Room.updateOne(
        { _id: room },
        {
          $push: { messages: { user: userId, message, createAt: Date.now() } },
        },
      );
    } catch (error) {
      logger.error('chatHandler - chatMessage error', error);
      socket.emit('handle-error', error.message);
      socket.disconnect(true);
    }
  }

  socket.on('join-room', joinRoom);
  socket.on('chat-message', chatMessage);
};
