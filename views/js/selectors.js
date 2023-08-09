const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const btnInfo = document.querySelector(".btn-info");
const btnChat = document.querySelector(".btn-chat");
const btnUsers = document.querySelector(".btn-users");
const chatUser = document.querySelector(".chat-user");
const chatMain = document.querySelector(".chat-main");
const chatInfo = document.querySelector(".chat-info");
const chatInfoMatter = document.querySelector(".chat-info-matter");
const roomHeading = document.querySelector(".chat-sidebar h3");

btnInfo.addEventListener("click", () => {
  chatInfo.classList.remove("display-none");
  chatUser.classList.add("display-none");
  chatMain.classList.add("display-none");
});
btnChat.addEventListener("click", () => {
  chatMain.classList.remove("display-none");
  chatUser.classList.add("display-none");
  chatInfo.classList.add("display-none");
});
btnUsers.addEventListener("click", () => {
  chatUser.classList.remove("display-none");
  chatInfo.classList.add("display-none");
  chatMain.classList.add("display-none");
});
