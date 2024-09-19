module.exports = function messagePing(message) {
    return `${Date.now() - message.createdTimestamp}`;
  };
  