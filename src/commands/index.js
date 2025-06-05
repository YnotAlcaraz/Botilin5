const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
const dotenv = require("dotenv");

dotenv.config();
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const isProd = process.env.ENVIRONMENT === "production";

const loadCommands = async (client) => {
  const commands = [];
  const commandsPath = __dirname;
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file !== "index.js" && file.endsWith("js"));

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    }
  }

  try {
    if (isProd) {
      console.log("Adding global commands");
      await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });
      console.log("Added global commands");
    } else {
      if (!guildId) {
        throw new Error("Missing guild_id");
      }

      // Delete the existing global commands to avoid conflicts
      console.log("Deleting previous global commands");
      await rest.put(Routes.applicationCommands(clientId), {
        body: [],
      });
      console.log("Deleted previous global commands");

      // Add the guild commands
      console.log("Adding Guild commands");
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
      console.log("Added guild commands");
    }
  } catch (err) {
    console.log("Error adding commands: ", err);
  }
};

module.exports = { loadCommands };
