const { Client, GatewayIntentBits, Partials } = require('discord.js');
const CustomEmbedBuilder = require('./functions/embedBuilder');
const commandFunctions = require('./functions/commandFunctions');

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
      if (message.author.bot || !message.content.startsWith(this.prefix)) return;
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
        this.handleEmbedCommand(command, message);
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

  handleEmbedCommand(command, message) {
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
  }

  replacePlaceholders(text, message) {
    const iconURL = message.guild.iconURL({ format: 'png', size: 1024 });

    return text
      .replaceAll('<$client.ping>', commandFunctions.clientPing(this.client))
      .replaceAll('<$message.ping>', commandFunctions.messagePing(message))
      .replaceAll('<$client.username>', commandFunctions.clientUsername(this.client))
      .replaceAll('<$author.username>', commandFunctions.authorUsername(message))
      .replaceAll('<$user.id>', commandFunctions.userId(message.author))
      .replaceAll('<$guild.name>', commandFunctions.guildName(message.guild))
      .replaceAll('<$channel.name>', commandFunctions.channelName(message.channel))
      .replaceAll('<$guild.memberCount>', commandFunctions.guildMemberCount(message.guild))
      .replaceAll('<$guild.icon>', iconURL || '')
      .replaceAll('<$channel.id>', message.channel.id)
      .replaceAll('<$message.createdAt>', commandFunctions.messageCreatedAt(message))
      .replaceAll('<$user.tag>', commandFunctions.userTag(message.author))
      .replaceAll('<$member.joinedAt>', commandFunctions.memberJoinedAt(message.member))
      .replaceAll('<$guild.region>', commandFunctions.guildRegion(message.guild))
      .replaceAll('<$client.uptime>', commandFunctions.clientUptime(this.client))
      .replaceAll('<$message.content>', commandFunctions.messageContent(message))

            // Nuevo para manejar roles con ID opcional
            .replace(/<\$user.roles(?:\: "(.*?)")?>/g, (match, userId) => {
              return commandFunctions.userRoles(message.guild, message.member, userId || message.author.id);
          })
          // Nuevo para manejar avatar con ID opcional
          .replace(/<\$user.avatar(?:\: "(.*?)")?>/g, (match, userId) => {
              return commandFunctions.userAvatar(message.guild, message.member, userId || message.author.id);
          })
          .replace(/<\$image: "(.*?)">/g, (_, url) => commandFunctions.image(url))
          .replace(/<\$thumbnail: "(.*?)">/g, (_, url) => this.validateURL(url) ? url : '')
          
      
      .replace(/<\$channel.type(?:\: "(.*?)")?>/g, (match, id) => {
        return id ? commandFunctions.channelType(message.guild, id) : commandFunctions.channelType(message.channel);
      })
      
      .replaceAll('<$client.guildCount>', commandFunctions.clientGuildCount(this.client))
      .replaceAll('<$client.memberCount>', commandFunctions.clientMemberCount(this.client))
      .replaceAll('<$commands.count>', commandFunctions.commandsCount(this.commands))
      .replaceAll('<$guild.id>', commandFunctions.guildId(message.guild))
  }

  validateURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      console.error(`URL no válida: ${url}`);
      return false;
    }
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
