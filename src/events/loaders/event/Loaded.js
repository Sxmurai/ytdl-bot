const { Event } = require("../../../structures/loaders");

module.exports = class EventsLoadedEvent extends (
  Event
) {
  constructor(client) {
    super(client, {
      name: "loaded",
      emitter: "events",
      once: true,
    });
  }

  run({ size }) {
    console.log(`Loaded ${size} event${size > 1 ? "s" : ""}`);
  }
};
