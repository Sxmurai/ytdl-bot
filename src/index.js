const { Intents } = require("discord.js");
const { MusicClient } = require("./structures");

const client = new MusicClient({
  config: require("../config.json"),
  ws: {
    intents: new Intents()
      .add("GUILDS")
      .add("GUILD_MESSAGES")
      .add("GUILD_VOICE_STATES"),
  },
});

client
  .login()
  .then(() => console.log("Logging in..."))
  .catch((error) => console.error(error));
