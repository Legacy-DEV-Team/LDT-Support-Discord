module.exports = {
  // Discord
  token: "YOUR_DISCORD_BOT_TOKEN",
  clientId: "YOUR_DISCORD_CLIENT_ID",
  guildId: "YOUR_DISCORD_GUILD_ID",

  // Roller (bruk Discord rolle-ID’er)
  defaultSupportRoles: [
    "123456789012345678", // f.eks. Support
    "223456789012345678"  // f.eks. Trainee
  ],

  claimRoles: [
    "123456789012345678",
    "323456789012345678"
  ],

  promoteRoles: [
    "323456789012345678",
    "423456789012345678"
  ],

  closeRoles: [
    "323456789012345678",
    "423456789012345678"
  ],

  reopenRoles: [
    "123456789012345678",
    "423456789012345678"
  ],

  // Valgfri kanal-ID for ticket-logging
  ticketLogChannelId: "567890123456789012"
};
