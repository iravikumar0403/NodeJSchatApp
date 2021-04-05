const io = require("socket.io")(8000);

let users = {}; //list of all active users

io.on("connection", (socket) => {
  //establishing connection
  socket.on("newUser", (name) => {
    //listen to newUser event which is emitted by script.js from client
    users[socket.id] = name;
    socket.broadcast.emit("userConnected", name); //emit eveny for client
    io.emit("userlistupdate", users);
  });

  socket.on("msgsend", (data) => {
    //listen to msgsend event which is emitted by script.js from client
    socket.broadcast.emit("messageReceive", {
      //emit event for client
      message: data.message,
      user: users[data.user],
    });

    socket.on("disconnect", () => {
      //listen to discoonect event which is emitted by socket.io on discconection
      socket.broadcast.emit("user-disconnected", users[socket.id]);
      delete users[socket.id]; //delete user who got disconnected
      io.emit("userlistupdate", users); //emit event for client
    });
  });
});
