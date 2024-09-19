const Toru = require('./index.js');
const path = require('path');
const fs = require('fs');

// Configuración del bot
const bot = new Toru({
  token: 'MTI3OTU4MjYyNjU1Nzk4NDg3MA.G6qNW_.DK6lKHbWcG6dWhVgO-BXxfgcmye6DwvNbxqrXY', // Asegúrate de reemplazar con tu token
  prefix: '!',
});

// Carga comandos desde la carpeta 'commands'
function loadCommands(directory) {
  const commandFiles = fs.readdirSync(directory).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const commandPath = path.join(directory, file);
    const command = require(commandPath);
    bot.command(command);
  }
}

// Cargar comandos desde la carpeta 'commands'
loadCommands(path.join(__dirname, 'commands'));

// Configuración de comandos (puedes dejar esto o moverlo a archivos separados en la carpeta 'commands')
bot.command({
  trigger: 'hello',
  response: 'Hello, <$author.username>! Mi ping es <$client.ping>.',
});

bot.command({
  trigger: 'info',
  response: 'Mi nombre es <$client.username> y el ping del mensaje es <$message.ping>.',
});

bot.command({
  trigger: 'showimage',
  response: '<$image: "https://example.com/imagen.jpg">',
});

bot.command({
  trigger: 'say',
  execute: (ctx, args) => {
    ctx.send(args.join(' '));
  },
});

bot.command({
  trigger: 'embed',
  embed: {
    title: '<$client.username> Information',
    description: 'Este es un embed personalizado hecho por <$author.username>',
    footer: {
      text: 'Mensaje enviado por <$author.username>',
      iconURL: 'https://i.pinimg.com/564x/47/a8/e8/47a8e8453582cdd1a7d7cfb719dd395f.jpg'
    },
    color: '#FF5733',
    image: '<$guild.icon>',
    thumbnail: 'https://i.pinimg.com/564x/47/a8/e8/47a8e8453582cdd1a7d7cfb719dd395f.jpg'
  }
});

bot.command({
  trigger: 'botinfo',
  embed: {
    title: '<$client.username> Information',
    description: `> **📊 Statistics**
    🆔 ID: <$user.id>
    🎛️ Ping: <$client.ping>
    🔁 Uptime: <$client.uptime>
    💭 Message ping: <$message.ping>
    ⭐ Servers: <$client.guildCount>
    👤 Members: <$client.memberCount>
    📕 Commands: <$commands.count>
    `,
    footer: {
      text: 'Mensaje enviado por <$author.username>',
      iconURL: 'https://i.pinimg.com/564x/47/a8/e8/47a8e8453582cdd1a7d7cfb719dd395f.jpg'
    },
    color: '#FF5733',
    thumbnail: 'https://i.pinimg.com/564x/47/a8/e8/47a8e8453582cdd1a7d7cfb719dd395f.jpg'
  }
});

// Iniciar el bot
bot.start();
