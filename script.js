// client side socket instance
const socket = io("http://localhost:8000");

// getting the html elements into js variables
const messageContainer = document.getElementById("message-container");
const sendForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const activeUsersEl = document.getElementById("activeusers");

// DOM manipulation
// show user joined message
function userConnect(name) {
  let userJoinedEl = document.createElement("div");
  userJoinedEl.innerText = `${name} joined the chat`;
  userJoinedEl.className = "userStatus";
  messageContainer.append(userJoinedEl);
}
//update chat messages in Dom
function updateMsg(data) {
  let messageEl = document.createElement("div");
  messageEl.innerText = `${data.user}: ${data.message}`;
  messageEl.className = "message";
  data.user === "You"
    ? messageEl.classList.add("right")
    : messageEl.classList.add("left");
  messageContainer.append(messageEl);
  var l = document.getElementsByClassName("message").length;
  document.getElementsByClassName("message")[l - 1].scrollIntoView();
}

// show user left message
function userDisconnect(name) {
  let userJoinedEl = document.createElement("div");
  userJoinedEl.innerText = `${name} left the chat`;
  userJoinedEl.className = "userStatus";
  messageContainer.append(userJoinedEl);
}

// get the name of user
let userName = window.prompt("Enter your name");
// emit socket events from client side
socket.emit("newUser", userName);

// emit msg send event
sendForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = messageInput.value;
  messageInput.value = "";
  updateMsg({ user: "You", message: message });
  socket.emit("msgsend", { user: socket.id, message: message });
});

// listen to socket events from server
socket.on("userConnected", (name) => {
  userConnect(name);
});

socket.on("messageReceive", (data) => {
  updateMsg(data);
});

socket.on("user-disconnected", (name) => {
  userDisconnect(name);
});

socket.on("userlistupdate", (users) => {
  activeUsersEl.innerHTML = `<h2>Active Users</h2>`;
  // updating list of active users
  for (id in users) {
    let userEl = document.createElement("p");
    userEl.innerText = users[id];
    activeUsersEl.append(userEl);
  }
});
