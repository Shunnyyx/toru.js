const { MessageEmbed } = require('discord.js');
const EmbedBuilder = require('./embedBuilder'); // Asegúrate de tener este archivo

class CommandHandler {
  constructor(prefix) {
    this.prefix = prefix;
    this.commands = new Map();
  }

  registerCommand(trigger, response, execute, embed) {
    this.commands.set(trigger, { response, execute, embed });
  }

  handleCommand(message) {
    const args = message.content.slice(this.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (this.commands.has(command)) {
      const cmd = this.commands.get(command);
      if (cmd.embed) {
        const embedBuilder = new EmbedBuilder()
          .addTitle(cmd.embed.title)
          .addDescription(cmd.embed.description)
          .addFooter(cmd.embed.footer.text, cmd.embed.footer.iconURL)
          .addColor(cmd.embed.color)
          .addImage(cmd.embed.image)
          .addThumbnail(cmd.embed.thumbnail);

        message.channel.send({ embeds: [embedBuilder.build()] });
      } else if (cmd.response) {
        const response = cmd.response.replace(/<\$(\w+)\.([\w\.]+)>/g, (match, obj, prop) => {
          switch (obj) {
            case 'client':
              return this.client[prop] || 'undefined';
            case 'message':
              return message[prop] || 'undefined';
            case 'author':
              return message.author[prop] || 'undefined';
            case 'guild':
              return message.guild[prop] || 'undefined';
            case 'commands':
              return this.commands.size;
            default:
              return match;
          }
        });

        message.channel.send(response);
      } else if (cmd.execute) {
        cmd.execute({ send: (msg) => message.channel.send(msg) }, args);
      }
    }
  }
}

module.exports = CommandHandler;
