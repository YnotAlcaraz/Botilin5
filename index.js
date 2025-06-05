const { Client, GatewayIntentBits, Collection } = require("discord.js");
const dotenv = require("dotenv");
const { loadCommands } = require("./src/commands");

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

loadCommands(client);

client.once("ready", () => {
  console.log("==============================");
  console.log(`Bot ready as ${client.user.tag}`);
  console.log("==============================");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "Error while executing the command",
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
