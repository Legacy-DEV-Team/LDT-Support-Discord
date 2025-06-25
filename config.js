module.exports = { 
  // Discord 
  token: "DISCORD_BOT_TOKEN_ID",
  clientId: "DISCORD_BOT_CLIENT_ID",
  guildId: "DISCORD_SERVER_ID",
  ownerId: "DISCORD_SERVER_OWNER_ID",

  // Roles (use Discord role IDs) 
  defaultSupportRoles: [ 
    "DISCORD_SERVER_SUPPORT_TIER_1_ROLE_ID"  // Support 
  ], 

  claimRoles: [ 
    "DISCORD_SERVER_SUPPORT_TIER_1_ROLE_ID", // Support 
    "DISCORD_SERVER_SUPPORT_TIER_2_ROLE_ID"  // Developer
  ], 

  promoteRoles: [ 
    "DISCORD_SERVER_SUPPORT_TIER_1_ROLE_ID", // Support 
    "DISCORD_SERVER_SUPPORT_TIER_2_ROLE_ID"  // Developer
  ], 

  closeRoles: [ 
    "DISCORD_SERVER_SUPPORT_TIER_1_ROLE_ID", // Support 
    "DISCORD_SERVER_SUPPORT_TIER_2_ROLE_ID"  // Developer
  ], 

  reopenRoles: [ 
    "DISCORD_SERVER_SUPPORT_TIER_1_ROLE_ID", // Support 
    "DISCORD_SERVER_SUPPORT_TIER_2_ROLE_ID"  // Developer
  ], 

  // Optional channel ID for ticket logging 
  ticketLogChannelId: "DISCORD_SERVER_LOG_CHANNEL_ID"
};