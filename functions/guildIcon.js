module.exports = function guildIcon(guild) {
    return guild.iconURL() || 'No icon available';
  };
  