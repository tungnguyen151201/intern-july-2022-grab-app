const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const { User } = require('../../models');
const { redisClient } = require('../../utils/redis');

async function signUp(args) {
  try {
    const { username, password, role } = args.userInput;
    const existedUser = await User.findOne({ username }).lean();
    if (existedUser) {
      return {
        isSuccess: false,
        message: 'Username invalid or already taken',
      };
    }
    if (role === 'Admin') {
      return {
        isSuccess: false,
        message: 'Cannot create admin account',
      };
    }
    const hashedPassword = await argon2.hash(password);
    const user = await User.create(
      role === 'Driver'
        ? { ...args.userInput, password: hashedPassword, status: 'Pending' }
        : { ...args.userInput, password: hashedPassword },
    );
    return {
      isSuccess: true,
      message: 'Sign up successfully',
      user,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error,
    };
  }
}

async function login(args) {
  const { username, password } = args;
  try {
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return {
        isSuccess: false,
        message: 'Invalid Credentials!',
      };
    }

    const match = await argon2.verify(user.password, password);
    if (!match) {
      return {
        isSuccess: false,
        message: 'Invalid Credentials!',
      };
    }

    if (user.status === 'Pending' || user.status === 'Deactivated') {
      return {
        isSuccess: false,
        message: 'Invalid Credentials!',
      };
    }

    const token = jwt.sign({ userId: user._id.toString() }, config.jwt.secretKey, { expiresIn: config.jwt.expireTime });

    return {
      isSuccess: true,
      message: 'Login successfully',
      token,
      user,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error,
      token: null,
    };
  }
}

async function activateDriver(args, context) {
  const { username, deactivate } = args;
  const { userRole } = context.signature;

  if (userRole !== 'Admin') {
    return {
      isSuccess: false,
      message: 'Permission denied',
    };
  }

  const user = await User.findOne({ username }).lean();
  if (!user) {
    return {
      isSuccess: false,
      message: 'User not found',
    };
  }

  if (user.role !== 'Driver') {
    return {
      isSuccess: false,
      message: 'User must be a Driver',
    };
  }

  let status;
  if (deactivate) {
    if (user.status === 'Pending' || user.status === 'Deactivated') {
      return {
        isSuccess: false,
        message: 'Driver has already been deactivated',
      };
    }
    status = 'Deactivated';
  } else {
    if (user.status === 'Active') {
      return {
        isSuccess: false,
        message: 'Driver has already been activated',
      };
    }
    status = 'Active';
  }

  // Update db
  const driver = await User.findByIdAndUpdate(user._id.toString(), { status }, { new: true }).lean();

  // Delete cache
  redisClient.del(driver._id.toString());

  return {
    isSuccess: true,
    message: deactivate
      ? 'Deactivate driver successfully'
      : 'Activate driver successfully',
    driver,
  };
}

module.exports = {
  signUp,
  login,
  activateDriver,
};
