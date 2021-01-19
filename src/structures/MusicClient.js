const { Client } = require("discord.js");
const { join } = require("path");

const { CommandLoader, EventLoader } = require("./loaders");

module.exports = class MusicClient extends (
  Client
) {
  /**
   * @param {import("discord.js").ClientOptions} options
   */
  constructor(options) {
    super(options);

    // set the config
    this.config = options.config;

    // set the token
    this.token = this.config.token;

    // the command loader
    this.commands = new CommandLoader(this, {
      owners: options.config?.owners ?? [],
      path: join(process.cwd(), "src", "commands"),
      prefixes: options.config?.prefix,
    });

    // the event loader
    this.events = new EventLoader(this, {
      path: join(process.cwd(), "src", "events"),
    });
  }

  // override login
  login() {
    this.events.options.emitters = {
      commands: this.commands,
      events: this.events,
      client: this,
    };

    // load all of the modules in each loader
    [this.events, this.commands].forEach((x) => x.loadAll());

    // login
    return super.login();
  }
};
