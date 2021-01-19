const { Event } = require("../../../structures/loaders");

module.exports = class EventsLoadedEvent extends (
  Event
) {
  constructor(client) {
    super(client, {
      name: "loaded",
      emitter: "commands",
      once: true,
    });
  }

  run({ size }, failures) {
    console.log(
      `Loaded ${size} commands${size > 1 ? "s" : ""} with ${failures} failures`
    );
  }
};
