// functions/clientMemberCount.js
function clientMemberCount(client) {
    let memberCount = 0;
    client.guilds.cache.forEach(guild => {
      memberCount += guild.memberCount;
    });
    return memberCount;
  }
  
  module.exports = clientMemberCount;
  