const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");

module.exports = class Player {
  /**
   * @param {import("discord.js").Message} message
   */
  constructor() {
    this.queue = [];
    this.playing = null;
    this.repeating = "none";

    this.dispatcher = null; // oh yes, good ol dispatcher
  }

  add(url, requester, title) {
    this.queue.push({ url, requester, title });
  }

  next() {
    return (this.playing = this.queue.shift());
  }

  start(message, connection) {
    this.message = message;

    if (!this.playing) {
      this.next();
    }

    this.dispatcher = connection.play(
      ytdl(this.playing.url, { filter: "audioonly" }) // filter is "audioonly" so its faster
    );

    this._addEvents(this.dispatcher, connection);
  }

  _addEvents(dispatcher, connection) {
    dispatcher
      .on("finish", () => {
        // handle repeating
        if (this.repeating !== "none") {
          if (this.repeating === "queue") {
            this.queue.push(this.playing);
          } else if (this.repeating === "track") {
            this.queue.unshift(this.playing);
          }
        }

        this.next();

        if (!this.playing) {
          return this.message.channel
            .send(
              new MessageEmbed()
                .setColor(this.message.client.config.colors.normal)
                .setDescription("Queue has ended, I'll be leaving now")
            )
            .then(() => {
              this.dispatcher.destroy();
              this.message.guild.me.voice.channel.leave();
              this.message.client.players.delete(this.message.guild.id);
            });
        }

        // play, again lol
        this.dispatcher = connection.play(
          ytdl(this.playing.url, { filter: "audioonly" })
        );

        this._addEvents(this.dispatcher, connection); // since this has to be changed, here we go.
      })
      .on("start", async () => {
        this.message.channel.send(
          new MessageEmbed()
            .setColor(this.message.client.config.colors.normal)
            .setDescription(
              `[${this.playing.title}](${this.playing.url}) :: [<@!${this.playing.requester}>]`
            )
        );
      });
  }
};
