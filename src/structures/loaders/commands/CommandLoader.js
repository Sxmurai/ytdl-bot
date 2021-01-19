const Util = require("../../Util");
const BaseLoader = require("../BaseLoader");

const MENTION_PREFIX_REGEX = /<@!?(\d{17,19})>\s*/gi;

module.exports = class CommandLoader extends (
  BaseLoader
) {
  /**
   * Creates a new instance of a CommandLoader
   * @param {import("discord.js").Client} client
   * @param {HandlerOptions} options
   */
  constructor(client, options = {}) {
    super(client);

    options.owners = options.owners ? Util.toArray(options.owners) : [];

    /**
     * The command handler options
     * @type {HandlerOptions}
     */
    this.options = options;
  }

  /**
   * Loads all of the commands
   */
  loadAll() {
    let failures = 0;

    for (const file of Util.walk(this.options.path)) {
      const command = new (require(file))(this.client);

      if (!command) {
        ++failures;
        continue;
      }

      this.modules.set(command.options.trigger, command);
    }

    this.emit("loaded", this.modules, failures);

    this.client.on("message", (msg) => this.handle(msg));
  }

  /**
   * Finds a certain command
   * @param {string} cmd
   */
  findCommand(cmd) {
    return this.modules.find((c) =>
      [c.options.trigger, ...(c.options.triggers ?? [])].includes(cmd)
    );
  }

  /**
   * Handles the message event
   * @param {import("discord.js").Message} message
   * @private
   */
  handle(message) {
    if (message.author.bot) {
      return;
    }

    const raw = message.content.toLowerCase();

    let prefix = this.findPrefix(message, raw);

    if (raw.match(MENTION_PREFIX_REGEX)) {
      const matches = raw.match(MENTION_PREFIX_REGEX);
      if (!raw.startsWith(matches[0])) {
        return;
      }

      prefix = matches[0];
    }

    if (!prefix) {
      return;
    }

    const [cmd, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    const command = this.findCommand(cmd);

    if (command) {
      if (command.options.restrictions) {
        if (
          command.options.restrictions?.owner &&
          !this.options.owners.includes(message.author.id)
        ) {
          this.emit("blocked", message, command, "owner");
          return;
        }

        if (command.options.restrictions?.guild && !message.guild) {
          this.emit("blocked", message, command, "guild");
          return;
        }
      }

      try {
        command.run.bind(command);
        command.run(message, args);

        this.emit("executed", command, message);
      } catch (exception) {
        this.emit("error", message, exception);
      }
    }
  }

  /**
   * The messages content and shit
   * @param {string} content
   * @private
   */
  findPrefix(message, content) {
    const parsed =
      typeof this.options.prefixes === "function"
        ? this.options.prefixes(message)
        : this.options.prefixes;
    const prefixes = Util.toArray(parsed);

    return prefixes.find((prefix) => content.toLowerCase().startsWith(prefix));
  }
};

/**
 * @typedef {Object} HandlerOptions
 * @prop {string} path
 * @prop {((msg: import("discord.js").Message) => string | string[]) | string | string[]} prefixes
 * @prop {string | string[]} owners
 */
