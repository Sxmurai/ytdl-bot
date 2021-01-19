module.exports = class Event {
  /**
   * Creates a new instance of an Event
   * @param {import("discord.js").Client} client
   * @param {EventOptions} options
   */
  constructor(client, options) {
    this.client = client;

    options.once = options.once ?? false;

    /**
     * The events options
     * @type {EventOptions}
     */
    this.options = options;
  }

  run() {
    throw new Error(`${this.constructor.name}.run() was not implemented.`);
  }
};

/**
 * @typedef {Object} EventOptions
 * @prop {string} name
 * @prop {boolean} once
 * @prop {string} emitter
 */
