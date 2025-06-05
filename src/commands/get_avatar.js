const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const handleGetAvatar = async (interaction) => {
  const user = interaction.options.getUser("user") || interaction.user;

  const embed = new EmbedBuilder()
    .setTitle(`${user.username}'s avatar`)
    .setDescription(
      `[**Open in a new window**](${user.displayAvatarURL({
        dynamic: true,
        size: 1024,
      })})`
    )
    .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setColor(0x5865f2);
  await interaction.reply({ embeds: [embed] });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Gets the user avatar")
    .addUserOption((option) =>
      option.setName("user").setDescription("User").setRequired(false)
    ),
  execute: handleGetAvatar,
};
