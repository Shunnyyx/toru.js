module.exports = function clientPing(client) {
    return `${client.ws.ping}`;
  };
  