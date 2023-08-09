let username, room, roomId;
// Get username and room from URL
const query = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

if (query.roomId) {
  username = query.username;
  roomId = query.roomId;
  socket.emit("joinRoom", { roomId, username });
} else {
  // Create chatroom
  username = query.username;
  room = query.room;
  socket.emit("createRoom", { username, room });
}
// getting error
socket.on("errorWhileJoining", async () => {
  await alert(
    "Problem With Joining Link ! 😔😔\nPlease Join with correct link"
  );
  window.location.href = "/";
});
// get roomInfo
socket.on("roomCreated", ({ data }) => {
  outputInfo(data);
});
// get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  outputMessage(message);

  //   Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  //   Emit message to server
  socket.emit("chatMessage", msg);

  //   Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// output message to dom
function outputMessage(message) {
  const div = document.createElement("div");
  if (message.username === username) {
    div.classList.add("message-active");
  } else {
    div.classList.add("message");
  }

  div.innerHTML = `
  <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>

`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomHeading.innerText = `Room Name :  ${room}`;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li> `).join("")}
    `;
}

// Add room Info
function outputInfo(data) {
  chatInfoMatter.innerHTML = `<p>To join the room, click this link : <a href='${data}' id = 'chat-info-link' target = '_blank'>${data}</a></p>
  <div class="chat-info-copy">Copy to clipboard</div>
`;
  const chatInfoCopy = document.querySelector(".chat-info-copy");
  const chatInfoLink = document.getElementById("chat-info-link");

  function CopyMe(TextToCopy) {
    var TempText = document.createElement("input");
    TempText.value = TextToCopy;
    document.body.appendChild(TempText);
    TempText.select();

    document.execCommand("copy");
    document.body.removeChild(TempText);

    alert("Successfully Copied the link ! 😊😊");
  }

  chatInfoCopy.addEventListener("click", () => {
    CopyMe(chatInfoLink.innerHTML);
  });
}
