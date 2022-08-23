const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const { User } = require('../../models');
const { redisClient, setBlockedToken } = require('../../utils/redis');

async function signUp(args) {
  try {
    const { username, password, role } = args.userInput;
    const existedUser = await User.findOne({ username }, '_id').lean();
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
    logger.error('UserCommand - signUp error:', error);
    return {
      isSuccess: false,
      message: error,
    };
  }
}

async function login(args) {
  try {
    const { username, password } = args;
    const user = await User.findOne({ username }, 'username password status').lean();
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

    const token = jwt.sign(
      { userId: user._id.toString() },
      config.jwt.secretKey,
      { expiresIn: config.jwt.expireTime },
    );

    return {
      isSuccess: true,
      message: 'Login successfully',
      token,
      user,
    };
  } catch (error) {
    logger.error('UserCommand - login error:', error);
    return {
      isSuccess: false,
      message: error,
      token: null,
    };
  }
}

async function activateDriver(args, context) {
  try {
    const { username, deactivate } = args;
    const { userRole } = context.signature;

    if (userRole !== 'Admin') {
      return {
        isSuccess: false,
        message: 'Permission denied',
      };
    }

    const user = await User.findOne({ username }, 'role status').lean();
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
          message: 'Driver already deactivated',
        };
      }
      status = 'Deactivated';
    } else {
      if (user.status === 'Active') {
        return {
          isSuccess: false,
          message: 'Driver already activated',
        };
      }
      status = 'Active';
    }

    // Update db
    const driver = await User.findByIdAndUpdate(
      user._id.toString(),
      { status },
      { new: true },
    ).lean();

    // Clear cache
    redisClient.del(driver._id.toString());

    return {
      isSuccess: true,
      message: deactivate
        ? 'Deactivate driver successfully'
        : 'Activate driver successfully',
      driver,
    };
  } catch (error) {
    logger.error('UserCommand - activateDriver error:', error);
    return { isSuccess: false, message: error };
  }
}

async function logout(__, context) {
  try {
    const { token } = context;
    if (!token) {
      return { isSuccess: false, message: 'Invalid token' };
    }

    const { exp } = jwt.verify(token, config.jwt.secretKey);
    await setBlockedToken(token, exp);

    return { isSuccess: true, message: 'Logged out' };
  } catch (error) {
    logger.error('UserCommand - logout error:', error);
    return { isSuccess: false, message: error };
  }
}

module.exports = {
  signUp,
  login,
  activateDriver,
  logout,
};
