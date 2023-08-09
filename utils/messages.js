const moment = require("moment");

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
}

function formatRoomInfo(id) {
  return {
    data: `https://bigb-chat-board.herokuapp.com/${id}`,
  };
}

module.exports = { formatMessage, formatRoomInfo };
