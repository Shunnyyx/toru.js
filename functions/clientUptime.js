module.exports = function clientUptime(client) {
    return `${Math.floor(client.uptime / 1000)} seconds`;
  };
  