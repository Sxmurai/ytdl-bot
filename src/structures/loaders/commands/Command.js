module.exports = class Command {
  /**
   * Creates a new instance of a Command
   * @param {import("discord.js").Client} client
   * @param {CommandOptions} options
   */
  constructor(client, options) {
    this.client = client;

    options.triggers = options.triggers ?? [];

    options.group = options.group ?? "No Group";

    options.description = options.description ?? {
      content: "No description has been provided for this command.",
    };

    options.disabled = options.disabled ?? false;

    options.restrictions = Object.assign(
      {
        owner: false,
        guild: false,
        user: [],
        bot: [],
      },
      options.restrictions ?? {}
    );

    /**
     * The events options
     * @type {CommandOptions}
     */
    this.options = options;
  }

  run() {
    throw new Error(`${this.constructor.name}.run() was not implemented.`);
  }
};

/**
 * @typedef {Object} CommandOptions
 * @prop {string} trigger
 * @prop {string} triggers
 * @prop {string} group
 * @prop {?CommandOptionsDescription} description
 * @prop {?CommandOptionsRestrictions} restrictions
 * @prop {boolean} disabled
 */

/**
 * @typedef {Object} CommandOptionsDescription
 * @prop {string} content
 * @prop {?string} usage
 * @prop {?string[]} examples
 */

/**
 * @typedef {Object} CommandOptionsRestrictions
 * @prop {?boolean} owner
 * @prop {?boolean} guild
 * @prop {?string[]} bot
 * @prop {?string[]} user
 */
