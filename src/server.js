require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;
const http = require("http");

const server =
  http.createServer(app);

const {
  initializeSocket,
} = require("./socket");

initializeSocket(server);

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
})