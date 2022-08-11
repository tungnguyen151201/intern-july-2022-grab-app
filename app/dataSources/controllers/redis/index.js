const generic = require('./GenericCommands');
const userControllers = require('./User');
const tokenControllers = require('./Token');

module.exports = {
  ...generic,
  ...userControllers,
  ...tokenControllers,
};
