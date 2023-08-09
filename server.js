const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { formatMessage, formatRoomInfo } = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);

app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
  res.render("index.html");
});
app.get("/:id", (req, res) => {
  res.render("join.html");
});

const botName = "ChatBoard Bot";

// Run when client connects

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomId, username }) => {
    const data = getRoomUsers(roomId).filter((user) => user.id === roomId);
    try {
      if (data.length) {
        let room = data[0].room;
        const user = userJoin(socket.id, username, room, roomId);

        socket.join(user.roomId);
        // Welcome current user
        socket.emit("message", formatMessage(botName, "Welcome to ChatBoard!"));

        io.to(user.roomId).emit("roomCreated", formatRoomInfo(user.roomId));

        // Broadcast when a user connects
        socket.broadcast
          .to(user.roomId)
          .emit(
            "message",
            formatMessage(botName, `${user.username} has joined the chat`)
          );

        // Send users and room info
        io.to(user.roomId).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.roomId),
        });
      } else {
        throw new Error("Problem with the link");
      }
    } catch (err) {
      console.log(err);
      io.to(socket.id).emit(
        "message",
        formatMessage(botName, "Problem with Joining Link !")
      );
      io.to(socket.id).emit(
        "message",
        formatMessage(botName, "Please join with the correct link !")
      );
      setTimeout(() => {
        io.to(socket.id).emit(
          "errorWhileJoining",
          formatMessage(botName, "Error while  joining")
        );
      }, 500);
    }
  });

  socket.on("createRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room, socket.id);
    socket.join(user.roomId);
    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatBoard!"));

    io.to(user.roomId).emit("roomCreated", formatRoomInfo(user.id));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.roomId)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.roomId).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.roomId),
    });
  });

  // Listen for chat message

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.roomId).emit("message", formatMessage(user.username, msg));
  });

  // Listens for draw methods
  socket.on("mouse", (data) => {
    const user = getCurrentUser(socket.id);

    socket.broadcast.to(user.roomId).emit("mouse", data);
  });

  // Listens for clear Canvas
  socket.on("clearCanvas", () => {
    const user = getCurrentUser(socket.id);

    io.to(user.roomId).emit("clearSketch");
  });
  // Runs when client disconnects

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.roomId).emit(
        "message",
        formatMessage(botName, `${user.username} user has left the chat`)
      );

      // Send users and room info
      io.to(user.roomId).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.roomId),
      });
    }
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
