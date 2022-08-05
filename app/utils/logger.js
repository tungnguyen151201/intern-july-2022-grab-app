const winston = require('winston');
const path = require('path');
const fs = require('fs-extra');
const config = require('../config');

const { createLogger, transports } = winston;

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD[T]HH:mm:ss.SSSZ' }),
  winston.format.json(),
);

fs.ensureDir(config.logPath);

const logger = createLogger({
  transports: [
    new (transports.File)({
      name: 'debugFile',
      filename: path.join(config.logPath, 'debug.log'),
      level: 'debug',
      format,
    }),
    new (transports.File)({
      name: 'infoFile',
      filename: path.join(config.logPath, 'info.log'),
      level: 'info',
      format,
    }),
    new (transports.File)({
      name: 'warningFile',
      filename: path.join(config.logPath, 'warning.log'),
      level: 'warn',
      format,
    }),
    new (transports.File)({
      name: 'errorFile',
      filename: path.join(config.logPath, 'error.log'),
      level: 'error',
      format,
    }),
    new (transports.File)({
      name: 'exceptionFile',
      filename: path.join(config.logPath, 'exceptions.log'),
      handleExceptions: true,
      humanReadableUnhandledException: true,
      level: 'error',
      format,
    }),
  ],
  exitOnError: false,
  levels: {
    debug: 4,
    info: 3,
    silly: 2,
    warn: 1,
    error: 0,
  },
});

module.exports = logger;
