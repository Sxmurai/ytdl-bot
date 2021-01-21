const { Command, Player } = require("../../structures");
const { MessageEmbed } = require("discord.js");

const ytdl = require("ytdl-core");

module.exports = class PingCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      trigger: "play",
      triggers: ["p"],
      description: {
        content: "Plays music",
      },
      restrictions: {
        guild: true,
      },
    });
  }

  /**
   * @param {import("discord.js").Message} message
   */
  async run(message, args) {
    const search = args.join(" ").replace(/<(.+)>/gi, "$1");

    if (!ytdl.validateURL(search)) {
      return message.channel.send(
        new MessageEmbed()
          .setColor(this.client.config.colors.error)
          .setDescription("I couldn't find anything for that query")
      );
    }

    if (!message.member.voice.channel) {
      return message.channel.send(
        new MessageEmbed()
          .setColor(this.client.config.colors.error)
          .setDescription("Please join a voice channel.")
      );
    }

    /**
     * @type {import("../../structures/music/Player")}
     */
    let player = this.client.players.get(message.guild.id);
    if (!player) {
      player = new Player();
      this.client.players.set(message.guild.id, player);
    }

    const info = await ytdl.getInfo(search);

    player.add(search, message.author.id, info.videoDetails.title);

    message.channel.send(
      new MessageEmbed()
        .setColor(this.client.config.colors.success)
        .setDescription(
          `Added To Queue - [${info.videoDetails.title}](${search})`
        )
    );

    if (!player.dispatcher) {
      const connection = await message.member.voice.channel.join();
      player.start(message, connection);
    }
  }
};
