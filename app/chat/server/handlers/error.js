module.exports = async socket => {
  socket.on('error', error => {
    socket.emit('handle-error', error.message);
    socket.disconnect(true);
  });
};
