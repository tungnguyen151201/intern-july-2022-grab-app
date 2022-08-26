const chat = require('./chat');
const error = require('./error');
const connection = require('./connection');

module.exports = {
  registerChatHandlers: chat,
  registerErrorHandlers: error,
  registerConnectionHandlers: connection,
};
