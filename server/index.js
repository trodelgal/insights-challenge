require("dotenv").config();
const app = require("./app");
const { scrapping } = require("./scrapping");
const http = require("http").createServer(app);
const socketIo = require("socket.io");
const io = socketIo(http);

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

setInterval(async () => {
  const posts = await scrapping();
  if (posts) {
    console.log(posts);
  }
}, 600000);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
