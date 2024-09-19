module.exports = function messageCreatedAt(message) {
    return message.createdAt.toISOString();
  };
  