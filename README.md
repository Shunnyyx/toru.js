# Toru.js

**Toru.js** is a lightweight library for creating Discord bots easily and quickly. Designed to be user-friendly, Toru.js enables developers, even those without prior experience, to build and manage Discord bots effortlessly.

## Features

- **Easy command definition**: Create commands with an intuitive syntax.
- **Custom embeds**: Generate Discord embeds easily.
- **Placeholder substitution**: Use placeholders to obtain dynamic information.
- **Event handling**: Respond to messages and events simply.

## Installation

To install Toru.js, use npm:

```bash
npm install toru.js
```

## Basic Usage

Here’s a basic example of how to use Toru.js:

```javascript
const Toru = require('toru.js');
const CustomEmbedBuilder = require('./functions/embedBuilder');

const bot = new Toru({
  token: 'YOUR_DISCORD_TOKEN',
  prefix: '!',
});

bot.command({
  trigger: 'hello',
  response: 'Hello, <$author.username>! My ping is <$client.ping>.',
});

bot.start();
```

## Defining Commands

You can define commands like this:

```javascript
bot.command({
  trigger: 'info',
  response: 'My name is <$client.username> and the message ping is <$message.ping>.',
});
```

## Commands with Embeds

To create a command that sends an embed:

```javascript
bot.command({
  trigger: 'embed',
  embed: {
    title: '<$client.username> Information',
    description: 'This is a custom embed made by <$author.username>',
    footer: {
      text: 'Message sent by <$author.username>',
      iconURL: 'ICON_URL',
    },
    color: '#FF5733',
  }
});
```

## Placeholders

Toru.js supports various placeholders for dynamic information:

- `<$client.ping>`: Displays the bot's ping.
- `<$author.username>`: Username of the message author.
- `<$guild.name>`: Name of the server.
- `<$image: "URL">`: Sends an image from the specified URL.

## Contributions

Contributions are welcome! If you’d like to contribute to Toru.js, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/new-feature`).
3. Make your changes and commit (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have questions or suggestions, feel free to reach out to me via [Discord](https://discord.gg/YQcwucm3hw).

### Customization

- Replace `YOUR_DISCORD_TOKEN` with instructions on how to obtain a token.
- Update the `ICON_URL` placeholder with an actual image URL.
- Change the contact email to your actual email address.
- Feel free to add more examples or sections as needed, such as installation of dependencies or specific tutorials.
