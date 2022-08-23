const { Room } = require('../../models');
const { getFields } = require('../../utils');

async function getRoomById(args, context, info) {
  try {
    const { userId } = context.signature;

    const { id } = args;
    let fields = getFields(info);
    if (!fields.includes('user1')) fields += ' user1';
    if (!fields.includes('user2')) fields += ' user2';

    const room = await Room.findById(id, fields).lean();
    if (userId !== room.user1.toString() && userId !== room.user2.toString()) {
      return null;
    }

    return room;
  } catch (error) {
    logger.error('RoomQuery - getRoomById error:', error);
    throw error;
  }
}

async function getMyRooms(args, context, info) {
  try {
    const { userId } = context.signature;

    const { limit, cursor } = args;
    const fields = getFields(info);

    const filters = {
      $or: [
        { user1: userId },
        { user2: userId },
      ],
    };
    if (cursor) {
      filters._id = { $lt: cursor };
    }

    const rooms = await Room.find(filters, fields)
      .sort({ _id: -1 })
      .limit(limit || 10)
      .lean();

    return rooms;
  } catch (error) {
    logger.error('RoomQuery - getMyRooms error:', error);
    throw error;
  }
}

module.exports = {
  getRoomById,
  getMyRooms,
};
