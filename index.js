const { Client, GatewayIntentBits, Partials } = require('discord.js');
const CustomEmbedBuilder = require('./functions/embedBuilder');
const commandFunctions = require('./functions/commandFunctions'); // Importa todos los métodos de funciones

class Toru {
  constructor(options) {
    this.token = options.token;
    this.prefix = options.prefix || '!';
    this.commands = [];
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction]
    });

    this.setupEvents();
  }

  setupEvents() {
    this.client.once('ready', () => {
      console.log(`Bot conectado como ${this.client.user.tag}`);
    });

    this.client.on('messageCreate', (message) => {
      if (message.author.bot) return;
      if (!message.content.startsWith(this.prefix)) return;
      this.handleMessage(message);
    });
  }

  start() {
    this.client.login(this.token)
      .then(() => console.log('Bot iniciado...'))
      .catch(err => console.error('Error al iniciar el bot:', err));
  }

  command({ trigger, response, execute, embed }) {
    this.commands.push({ trigger, response, execute, embed });
  }

  handleMessage(message) {
    const args = message.content.slice(this.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = this.commands.find(cmd => cmd.trigger === commandName);

    if (command) {
      if (command.embed) {
        const embedBuilder = new CustomEmbedBuilder()
          .addTitle(this.replacePlaceholders(command.embed.title, message))
          .addDescription(this.replacePlaceholders(command.embed.description, message))
          .addFooter(
            this.replacePlaceholders(command.embed.footer?.text || '', message),
            command.embed.footer?.iconURL ? this.replacePlaceholders(command.embed.footer.iconURL, message) : null
          )
          .addColor(command.embed.color || '#FFFFFF')
          .addImage(this.replacePlaceholders(command.embed.image || '', message))
          .addThumbnail(this.replacePlaceholders(command.embed.thumbnail || '', message));

        message.channel.send({ embeds: [embedBuilder.build()] });
      } else if (command.response) {
        const response = this.replacePlaceholders(command.response, message);
        message.channel.send(response);
      } else if (command.execute) {
        command.execute({
          send: (msg) => message.channel.send(this.replacePlaceholders(msg, message)),
          message: message
        }, args);
      }
    }
  }

  replacePlaceholders(text, message) {
    const iconURL = message.guild.iconURL({ format: 'png', size: 1024 });

    return text
      .replace('<$client.ping>', commandFunctions.clientPing(this.client))
      .replace('<$message.ping>', commandFunctions.messagePing(message))
      .replace('<$client.username>', commandFunctions.clientUsername(this.client))
      .replace('<$author.username>', commandFunctions.authorUsername(message))
      .replace('<$user.id>', commandFunctions.userId(message.author))
      .replace('<$guild.name>', commandFunctions.guildName(message.guild))
      .replace('<$channel.name>', commandFunctions.channelName(message.channel))
      .replace('<$guild.memberCount>', commandFunctions.guildMemberCount(message.guild))
      .replace('<$guild.icon>', iconURL || '')
      .replace('<$channel.id>', message.channel.id)
      .replace('<$message.createdAt>', commandFunctions.messageCreatedAt(message))
      .replace('<$user.tag>', commandFunctions.userTag(message.author))
      .replace('<$member.joinedAt>', commandFunctions.memberJoinedAt(message.member))
      .replace('<$guild.region>', commandFunctions.guildRegion(message.guild))
      .replace('<$client.uptime>', commandFunctions.clientUptime(this.client))
      .replace('<$message.content>', commandFunctions.messageContent(message))
      .replace(/<\$channel.type(?:\: "(.*?)")?>/g, (match, id) => {
        if (id) {
          return commandFunctions.channelType(message.guild, id);
        } else {
          return commandFunctions.channelType(message.channel);
        }
      })
      .replace(/<\$image: "(.*?)">/g, (match, url) => commandFunctions.image(url))
      .replace(/<\$thumbnail: "(.*?)">/g, (match, url) => {
        try {
          new URL(url);
          return url;
        } catch (e) {
          console.error(`URL de thumbnail no válida: ${url}`);
          return '';
        }
      })
      .replace('<$client.guildCount>', commandFunctions.clientGuildCount(this.client))
      .replace('<$client.memberCount>', commandFunctions.clientMemberCount(this.client))
      .replace('<$commands.count>', commandFunctions.commandsCount(this.commands));
  }

  loadCommands(directory) {
    const fs = require('fs');
    const path = require('path');
    const commandFiles = fs.readdirSync(directory).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(path.join(directory, file));
      this.command(command);
    }
  }
}

module.exports = Toru;
