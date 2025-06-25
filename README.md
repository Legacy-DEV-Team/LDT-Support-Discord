## 🆘 LDT Support Discord Ticket Bot

**Developed by Legacy DEV Team**

LDT Support is a Discord bot for structured and secure ticket management. It utilizes threads, role-restricted actions, and button-only interaction for a clean and professional support workflow.

---

## 🚀 Features

- 🧩 **Zero user commands** – everything runs via buttons and slash setup/admin commands.
- 🧵 **Private thread per ticket** – scoped to support staff and the ticket creator.
- 🔐 **Automatic lock and archive on close**.
- 🔓 **Role- or creator-controlled reopen support**.
- 📈 **Escalation system** with role-tier logic.
- 🗑️ **Clear logging with `/clearlog` command (owner only)**.
- ⚙️ **Fully configurable** via `config.js`.

---

## ⚙️ Configuration

Edit the `config.js` file with your own values:

```js
module.exports = {
  // Discord bot credentials
  token: "DISCORD_BOT_TOKEN_ID",
  clientId: "DISCORD_BOT_CLIENT_ID",
  guildId: "DISCORD_SERVER_ID",
  ownerId: "DISCORD_SERVER_OWNER_ID",

  // Role-based access control
  defaultSupportRoles: [
    "DISCORD_SERVER_SUPPORT_TIER_1_ROLE_ID" // e.g., Support
  ],

  claimRoles: [
    "DISCORD_SERVER_SUPPORT_TIER_1_ROLE_ID",
    "DISCORD_SERVER_SUPPORT_TIER_2_ROLE_ID"
  ],

  promoteRoles: [
    "DISCORD_SERVER_SUPPORT_TIER_1_ROLE_ID",
    "DISCORD_SERVER_SUPPORT_TIER_2_ROLE_ID"
  ],

  closeRoles: [
    "DISCORD_SERVER_SUPPORT_TIER_1_ROLE_ID",
    "DISCORD_SERVER_SUPPORT_TIER_2_ROLE_ID"
  ],

  reopenRoles: [
    "DISCORD_SERVER_SUPPORT_TIER_1_ROLE_ID",
    "DISCORD_SERVER_SUPPORT_TIER_2_ROLE_ID"
  ],

  // Optional logging
  ticketLogChannelId: "DISCORD_SERVER_LOG_CHANNEL_ID"
};
````

> 🔒 **Never commit your bot token or sensitive IDs publicly.**

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Legacy-DEV-Team/LDT-Support-Discord
cd LDT-Support-Discord
npm install
```

---

## 🛠️ Deploy Slash Commands

Before using the bot, you must register slash commands in your guild:

```bash
npm run deploy
```

This registers both `/setup`, `/clearcache` and `/clearlog`.

---

## 🖥️ Running the Bot

Start the bot:

```bash
npm start
```

Then run the setup command in the desired support channel:

```bash
/setup
```

---

## ✅ Ticket Workflow

1. 🎟️ **User clicks “Create Ticket”** – a private thread is opened.
2. 👥 **Support Tier 1 role** + the user are added.
3. ✅ **Support can**:

   * Claim the ticket
   * Escalate to higher tiers
   * Close (locks + archives the thread)
4. 🔁 **Support or creator can reopen**, depending on `reopenRoles`.

---

## 🗑️ Admin Commands

| Command        | Description                                                             | Access         |
|----------------|-------------------------------------------------------------------------|----------------|
| `/setup`       | Initializes the ticket system in the current channel                    | Only `ownerId` |
| `/clearlog`    | Deletes all messages from the ticket log channel (≤ 14 days old)        | Only `ownerId` |
| `/clearcache`  | Clears in-memory ticket/user cache (resets tracking if stored in RAM)   | Only `ownerId` |

These commands are **restricted to the server owner** as defined in your `config.js` under `ownerId`.  
Use `/setup` in each support category/channel where you want the "Create Ticket" button to appear.


---

## 🛡️ Access Control Overview

| Action        | Role Required                   |
| ------------- | ------------------------------- |
| Create ticket | Anyone (button)                 |
| Claim ticket  | `claimRoles`                    |
| Escalate      | `promoteRoles`                  |
| Close ticket  | `closeRoles` or Ticket Creator  |
| Reopen ticket | `reopenRoles` or Ticket Creator |
| Clear log     | `ownerId` only                  |

---

## 📄 Template Role Setup Example

```js
defaultSupportRoles: ["1198729689276092498"], // Support
claimRoles: ["1198729689276092498", "1033955057001050194"],
promoteRoles: ["1198729689276092498", "1033955057001050194"],
closeRoles: ["1198729689276092498", "1033955057001050194"],
reopenRoles: ["1198729689276092498", "1033955057001050194"]
```

---

## 🧪 Status

* ✅ Discord.js v14+ compatible
* ✅ Built-in role security & fallback logic
* ✅ Locked thread enforcement
* ✅ Owner-only admin tools
* ✅ Fully local and self-hosted

---

## 👥 Maintained by

**Legacy DEV Team**
For questions, issues, or contributions, contact the maintainers or fork this project.

---

**© 2025 Legacy DEV Team — All rights reserved**