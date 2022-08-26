const { Room } = require('../../models');

async function createChatRoom(args, context) {
  try {
    const { tripId } = args;
    const existedRoom = await Room.findOne(
      {
        trip: tripId,
      },
      '_id',
    ).lean();

    if (existedRoom) {
      return {
        isSuccess: false,
        message: 'Room existed',
      };
    }

    const fields = 'customer driver status';
    const key = JSON.stringify({ tripId, fields });

    const { dataloaders } = context;
    const trip = await dataloaders.tripById.load(key);

    if (trip?.status !== 'Accepted' && trip?.status !== 'Driving') {
      return {
        isSuccess: false,
        message: 'Invalid trip',
      };
    }

    const { userId } = context.signature;
    const { customer, driver } = trip;

    if (userId !== customer.toString() && userId !== driver.toString()) {
      return {
        isSuccess: false,
        message: 'Permission denied',
      };
    }

    const room = await Room.create({
      trip: tripId,
      users: [customer, driver],
    });

    return {
      isSuccess: true,
      message: 'Room created successful',
      room,
    };
  } catch (error) {
    logger.error('RoomCommand - createChatRoom error:', error);
    return {
      isSuccess: false,
      message: error,
    };
  }
}

module.exports = {
  createChatRoom,
};
