// functions/clientGuildCount.js
function clientGuildCount(client) {
    return client.guilds.cache.size;
  }
  
  module.exports = clientGuildCount;
  