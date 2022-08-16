const { Trip } = require('../../models');

async function createTrip(args, context) {
  const { userId, userRole } = context.signature;
  if (userRole !== 'Customer') {
    return {
      isSuccess: false,
      message: 'Permission denied',
    };
  }
  try {
    const trip = await Trip.findOne({ customer: userId, status: { $in: ['Pending', 'Driving'] } }).lean();
    if (trip) {
      return {
        isSuccess: false,
        message: 'Trip created failed',
      };
    }
    const newTrip = await Trip.create({ ...args.tripInput, customer: userId, status: 'Pending', startDate: Date.now(), totalPaid: 1000 });
    return {
      isSuccess: true,
      message: 'Trip created successful',
      trip: newTrip,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error,
    };
  }
}

async function acceptTrip(args, context) {
  const { userId, userRole } = context.signature;
  if (userRole !== 'Driver') {
    return {
      isSuccess: false,
      message: 'Permission denied',
    };
  }
  try {
    const isDriving = await Trip.findOne({ driver: userId, status: 'Driving' }).lean();
    if (isDriving) {
      return {
        isSuccess: false,
        message: 'Invalid trip',
      };
    }
    let trip = await Trip.findById(args.id).lean();
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
    trip = await Trip.findByIdAndUpdate(args.id, { status: 'Driving', driver: userId }, { new: true }).lean();
    return {
      isSuccess: true,
      message: 'Trip accepted',
      trip,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error,
    };
  }
}

async function finishTrip(args, context) {
  const { userId, userRole } = context.signature;
  if (userRole !== 'Driver') {
    return {
      isSuccess: false,
      message: 'Permission denied',
    };
  }
  try {
    let trip = await Trip.findById(args.id).lean();
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
    trip = await Trip.findByIdAndUpdate(args.id, { status: 'Finished', endDate: Date.now() }, { new: true }).lean();
    return {
      isSuccess: true,
      message: 'Trip finished',
      trip,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error,
    };
  }
}

async function cancelTrip(args, context) {
  const { userId, userRole } = context.signature;
  if (userRole !== 'Customer') {
    return {
      isSuccess: false,
      message: 'Permission denied',
    };
  }
  try {
    let trip = await Trip.findById(args.id).lean();
    if (!trip) {
      return {
        isSuccess: false,
        message: 'Invalid trip',
      };
    }
    if ((trip.status !== 'Pending' && trip.status !== 'Driving') || trip.customer.toString() !== userId) {
      return {
        isSuccess: false,
        message: 'Invalid trip',
      };
    }
    trip = await Trip.findByIdAndUpdate(args.id, { status: 'Canceled' }, { new: true }).lean();
    return {
      isSuccess: true,
      message: 'Trip canceled',
      trip,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error,
    };
  }
}

module.exports = {
  createTrip,
  acceptTrip,
  finishTrip,
  cancelTrip,
};
