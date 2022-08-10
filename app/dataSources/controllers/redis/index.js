const generic = require('./GenericCommands');
const caching = require('./Caching');

module.exports = {
  ...generic,
  ...caching,
};
