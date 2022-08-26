const { Room } = require('../../models');
const { getFields } = require('../../utils');

async function getRoomById(args, context, info) {
  try {
    const { userId } = context.signature;

    const { id } = args;
    let fields = getFields(info);
    if (!fields.includes('users')) fields += ' users';

    const room = await Room.findById(id, fields).lean();

    if (!room) {
      return null;
    }

    const userIds = room.users.map(user => user.toString());
    if (!userIds.includes(userId)) {
      return null;
    }

    return room;
  } catch (error) {
    logger.error('RoomQuery - getRoomById error:', error);
    throw error;
  }
}

async function getRoomByTrip(args, context, info) {
  try {
    const { userId } = context.signature;

    const { trip } = args;
    let fields = getFields(info);
    if (!fields.includes('users')) fields += ' users';

    const room = await Room.findOne({ trip }, fields).lean();

    if (!room) {
      return null;
    }

    const userIds = room.users.map(user => user.toString());
    if (!userIds.includes(userId)) {
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
      users: userId,
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
  getRoomByTrip,
  getMyRooms,
};
