const { EmbedBuilder } = require('discord.js');

class CustomEmbedBuilder {
  constructor() {
    this.embed = new EmbedBuilder();
  }

  addTitle(title) {
    this.embed.setTitle(title);
    return this;
  }

  addDescription(description) {
    this.embed.setDescription(description);
    return this;
  }

  addFooter(footer, iconURL = null) {
    if (iconURL) {
      try {
        new URL(iconURL);
        this.embed.setFooter({ text: footer, iconURL: iconURL });
      } catch (e) {
        console.error(`URL de icono no válida: ${iconURL}`);
        this.embed.setFooter({ text: footer });
      }
    } else {
      this.embed.setFooter({ text: footer });
    }
    return this;
  }

  addColor(color) {
    this.embed.setColor(color);
    return this;
  }

  addImage(url) {
    try {
      new URL(url);
      this.embed.setImage(url);
    } catch (e) {
      console.error(`URL de imagen no válida: ${url}`);
      // No establecer ninguna imagen si la URL no es válida
    }
    return this;
  }

  addThumbnail(url) {
    if (url) {
      try {
        new URL(url);
        this.embed.setThumbnail(url);
      } catch (e) {
        console.error(`URL de thumbnail no válida: ${url}`);
        // No establecer thumbnail si la URL no es válida
      }
    }
    return this;
  }

  build() {
    return this.embed;
  }
}

module.exports = CustomEmbedBuilder;
