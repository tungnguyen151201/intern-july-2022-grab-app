const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const config = require('../../../../config');
const { User } = require('../../../models');
const redis = require('../../redis');

async function signUp(args, _context, _info) {
  const { username, password, role } = args.userInput;
  try {
    if (await User.findOne({ username })) {
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
        ? { ...args.userInput, password: hashedPassword, isActive: false }
        : { ...args.userInput, password: hashedPassword },
    );
    return {
      isSuccess: true,
      message: 'Sign up successfully',
      user,
    };
  } catch (err) {
    return {
      isSuccess: false,
      message: err,
    };
  }
}

async function login(args, _context, _info) {
  const { username, password } = args;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return {
        isSuccess: false,
        message: 'User not found',
      };
    }

    const match = await argon2.verify(user.password, password);
    if (!match) {
      return {
        isSuccess: false,
        message: 'Invalid password',
      };
    }

    if (user?.isActive === false) {
      return {
        isSuccess: false,
        message: "This account haven't been activated yet",
      };
    }

    const token = jwt.sign({ userId: user.id }, config.jwt.secretKey, { expiresIn: config.jwt.expireTime });

    return {
      isSuccess: true,
      message: 'Login successfully',
      token,
      user,
    };
  } catch (err) {
    return {
      isSuccess: false,
      message: err,
      token: null,
    };
  }
}
async function activateDriver(args, context, _info) {
  const { username, deactivate } = args;
  const { userRole } = context.signature;
  if (!userRole) {
    return {
      isSuccess: false,
      message: 'Unauthorized error',
    };
  }
  if (userRole !== 'Admin') {
    return {
      isSuccess: false,
      message: 'You must be an Admin',
    };
  }
  const user = await User.findOne({ username });
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
  if (user.isActive !== deactivate) {
    return {
      isSuccess: false,
      message: deactivate
        ? 'Driver has already been deactivated'
        : 'Driver has already been activated',
    };
  }
  // Update db
  const driver = await User.findByIdAndUpdate(user.id, { isActive: !deactivate });
  driver.isActive = !deactivate;

  // Caching
  redis.saveUser(driver);

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
