const Util = require("../../Util");
const BaseLoader = require("../BaseLoader");

module.exports = class EventLoader extends (
  BaseLoader
) {
  /**
   *
   * @param {import("discord.js").Client} client
   * @param {HandlerOptions} options
   */
  constructor(client, options = {}) {
    super(client);

    options.emitters = Object.assign({ client }, options.emitters);

    /**
     * The command handler options
     * @type {HandlerOptions}
     */
    this.options = options;
  }

  async loadAll() {
    for (const file of Util.walk(this.options.path)) {
      const event = new (require(file))(this.client);

      if (!event) {
        continue;
      }

      if (event.options.disabled) {
        continue;
      }

      const emitter = this.options.emitters[event.options?.emitter ?? "client"];
      if (!emitter) {
        continue;
      }

      emitter[event.options?.once ? "once" : "on"](
        event.options.name,
        event.run.bind(event)
      );

      this.modules.set(event.options.name, event);
    }

    this.emit("loaded", this.modules);
  }
};

/**
 * @typedef {Object} HandlerOptions
 * @prop {string} path
 * @prop {Object} emitters
 */
