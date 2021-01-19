const { runInThisContext } = require("vm");
const { Event } = require("../structures/loaders");

module.exports = class ReadyEvent extends (
  Event
) {
  constructor(client) {
    super(client, {
      name: "ready",
      emitter: "client",
      once: false,
    });
  }

  run() {
    console.log(`Logged in as ${this.client.user?.username}`);
  }
};
