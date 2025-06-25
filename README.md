## 🆘 LDT Support Discord Ticket Bot

**Developed by Legacy DEV Team**

LDT Support is a Discord bot for structured and secure ticket management. It utilizes threads, role-restricted actions, and button-only interaction for a clean and professional support workflow.

---

## 🚀 Features

- 🧩 **Zero user commands** – everything runs via buttons and one setup slash command.
- 🧵 **Private thread per ticket** – scoped to support staff and the ticket creator.
- 🔐 **Automatic lock and archive on close**.
- 🔓 **Role- or creator-controlled reopen support**.
- 📈 **Escalation system** with role-tier logic.
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
    "DISCORD_SERVER_SUPPORT_TIER_1_ROLE_ID", // e.g., Support
    "DISCORD_SERVER_SUPPORT_TIER_2_ROLE_ID"  // e.g., Developer
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
git clone <repo-url>
cd ldt-support-discord
npm install
```

---

## 🛠️ Deploy Slash Commands

Before using the bot, you must register the slash command in your guild:

```bash
npm run deploy
```

This will register `/setup tickets` as your setup command.

---

## 🖥️ Running the Bot

Start the bot:

```bash
npm start
```

Then run the setup slash command in a chosen support channel:

```bash
/setup tickets
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

## 🛡️ Access Control Overview

| Action        | Role Required                   |
| ------------- | ------------------------------- |
| Create ticket | Anyone (button)                 |
| Claim ticket  | `claimRoles`                    |
| Escalate      | `promoteRoles`                  |
| Close ticket  | `closeRoles` or Ticket Creator  |
| Reopen ticket | `reopenRoles` or Ticket Creator |

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
* ✅ Button-based UX only (no user slash commands)
* ✅ Locked thread enforcement
* ✅ Fully local and self-hosted

---

## 👥 Maintained by

**Legacy DEV Team**
For questions, issues, or contributions, contact the maintainers or fork this project.

---

**© 2025 Legacy DEV Team — All rights reserved**