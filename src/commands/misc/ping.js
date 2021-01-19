const { Command } = require("../../structures/loaders");
const { MessageEmbed } = require("discord.js");

module.exports = class PingCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      trigger: "ping",
      triggers: ["pong"],
      description: {
        content: "Displays the clients latency",
      },
    });
  }

  /**
   * @param {import("discord.js").Message} message
   */
  run(message) {
    const now = Date.now();

    return new Promise((res) => {
      this.client.api.channels[message.channel.id].typing
        .post()
        .then(() =>
          res(
            message.channel.send(
              new MessageEmbed()
                .setColor(this.client.config.colors.normal)
                .setDescription([
                  `💓 Heartbeat: **${this.client.ws.ping}ms**`,
                  `⏱️ Response: **${Date.now() - now}ms**`,
                ])
            )
          )
        );
    });
  }
};
