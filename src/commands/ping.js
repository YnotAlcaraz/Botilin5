const { SlashCommandBuilder } = require("discord.js");

const handlePing = async (interaction) => {
  await interaction.reply("🏓 Pong!");
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns a pong"),

  execute: handlePing,
};
