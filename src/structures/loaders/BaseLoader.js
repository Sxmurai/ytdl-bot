const { Collection } = require("discord.js");
const { EventEmitter } = require("events");

module.exports = class BaseLoader extends (
  EventEmitter
) {
  /**
   * Creates a new instance of a BaseLoader
   * @param {import("discord.js")} client
   */
  constructor(client) {
    super();

    /**
     * The client
     * @type {import("discord.js").Client}
     */
    this.client = client;

    /**
     * The modules of the loader
     * @type {Collection<string, any>}
     */
    this.modules = new Collection();
  }

  /**
   * Checks if something is a class
   * @param {any} value
   */
  isClass(value) {
    return (
      typeof value === "function" &&
      typeof value.prototype === "object" &&
      value.toString().substring(0, 5) === "class"
    );
  }
};
