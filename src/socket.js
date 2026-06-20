let io;

const initializeSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  return io;
};

const getIO = () => io;

module.exports = {
  initializeSocket,
  getIO,
};