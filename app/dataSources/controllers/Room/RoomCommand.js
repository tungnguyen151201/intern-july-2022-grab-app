const { Room } = require('../../models');

async function createChatRoom(args, context) {
  try {
    const { userToChat, name } = args;
    const { userId } = context.signature;

    const existedRoom = await Room.findOne({ user1: userId, user2: userToChat }, '_id').lean();
    if (existedRoom) {
      return {
        isSuccess: false,
        message: 'Room existed',
      };
    }
    const room = await Room.create({
      user1: userId,
      user2: userToChat,
      name: name || 'Chat room',
    });

    return {
      isSuccess: true,
      message: 'Room created successful',
      room,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error,
    };
  }
}

module.exports = {
  createChatRoom,
};
