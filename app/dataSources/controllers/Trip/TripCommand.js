const { Trip, Room } = require('../../models');
const { leaveRoom } = require('../../../chat/server');

async function createTrip(args, context) {
  try {
    const { userId, userRole } = context.signature;
    if (userRole !== 'Customer') {
      return {
        isSuccess: false,
        message: 'Permission denied',
      };
    }

    const trip = await Trip.findOne({ customer: userId, status: { $in: ['Pending', 'Accepted', 'Driving'] } }, '_id').lean();
    if (trip) {
      return {
        isSuccess: false,
        message: 'Trip created failed',
      };
    }

    const newTrip = await Trip.create({ ...args.tripInput, customer: userId, status: 'Pending', createAt: Date.now(), totalPaid: 1000 });
    return {
      isSuccess: true,
      message: 'Trip created successful',
      trip: newTrip,
    };
  } catch (error) {
    logger.error('TripCommand - createTrip error:', error);
    return {
      isSuccess: false,
      message: error,
    };
  }
}

async function acceptTrip(args, context) {
  try {
    const { userId, userRole } = context.signature;
    if (userRole !== 'Driver') {
      return {
        isSuccess: false,
        message: 'Permission denied',
      };
    }

    const isDriving = await Trip.findOne({ driver: userId, status: { $in: ['Accepted', 'Driving'] } }, '_id').lean();
    if (isDriving) {
      return {
        isSuccess: false,
        message: 'Invalid trip',
      };
    }

    let trip = await Trip.findById(args.id, 'status').lean();
    if (!trip) {
      return {
        isSuccess: false,
        message: 'Invalid trip',
      };
    }

    if (trip.status !== 'Pending') {
      return {
        isSuccess: false,
        message: 'Trip already taken',
      };
    }

    trip = await Trip.findByIdAndUpdate(args.id, { status: 'Accepted', driver: userId }, { new: true }).lean();
    return {
      isSuccess: true,
      message: 'Trip accepted',
      trip,
    };
  } catch (error) {
    logger.error('TripCommand - acceptTrip error:', error);
    return {
      isSuccess: false,
      message: error,
    };
  }
}

async function startTrip(args, context) {
  try {
    const { userId, userRole } = context.signature;
    if (userRole !== 'Driver') {
      return {
        isSuccess: false,
        message: 'Permission denied',
      };
    }

    let trip = await Trip.findById(args.id, 'status driver').lean();
    if (!trip) {
      return {
        isSuccess: false,
        message: 'Invalid trip',
      };
    }

    if (trip.status !== 'Accepted' || trip.driver.toString() !== userId) {
      return {
        isSuccess: false,
        message: 'Invalid trip',
      };
    }

    trip = await Trip.findByIdAndUpdate(args.id, { status: 'Driving', startTime: Date.now() }, { new: true }).lean();
    return {
      isSuccess: true,
      message: 'Trip started',
      trip,
    };
  } catch (error) {
    logger.error('TripCommand - startTrip error:', error);
    return {
      isSuccess: false,
      message: error,
    };
  }
}

async function finishTrip(args, context) {
  try {
    const { userId, userRole } = context.signature;
    if (userRole !== 'Driver') {
      return {
        isSuccess: false,
        message: 'Permission denied',
      };
    }

    let trip = await Trip.findById(args.id, 'status driver').lean();
    if (!trip) {
      return {
        isSuccess: false,
        message: 'Invalid trip',
      };
    }

    if (trip.status !== 'Driving' || trip.driver.toString() !== userId) {
      return {
        isSuccess: false,
        message: 'Invalid trip',
      };
    }

    trip = await Trip.findByIdAndUpdate(args.id, { status: 'Finished', endTime: Date.now() }, { new: true }).lean();

    const room = await Room.findOne({ trip: args.id }, '_id').lean();
    leaveRoom(room._id.toString());

    return {
      isSuccess: true,
      message: 'Trip finished',
      trip,
    };
  } catch (error) {
    logger.error('TripCommand - finishTrip error:', error);
    return {
      isSuccess: false,
      message: error,
    };
  }
}

async function cancelTrip(args, context) {
  try {
    const { userId, userRole } = context.signature;
    if (userRole !== 'Customer') {
      return {
        isSuccess: false,
        message: 'Permission denied',
      };
    }

    let trip = await Trip.findById(args.id, 'status customer').lean();
    if (!trip) {
      return {
        isSuccess: false,
        message: 'Invalid trip',
      };
    }

    if ((trip.status !== 'Pending' && trip.status !== 'Accepted') || trip.customer.toString() !== userId) {
      return {
        isSuccess: false,
        message: 'Invalid trip',
      };
    }

    trip = await Trip.findByIdAndUpdate(args.id, { status: 'Canceled' }, { new: true }).lean();

    const room = await Room.findOne({ trip: args.id }, '_id').lean();
    leaveRoom(room._id.toString());

    return {
      isSuccess: true,
      message: 'Trip canceled',
      trip,
    };
  } catch (error) {
    logger.error('TripCommand - cancelTrip error:', error);
    return {
      isSuccess: false,
      message: error,
    };
  }
}

module.exports = {
  createTrip,
  acceptTrip,
  startTrip,
  finishTrip,
  cancelTrip,
};
