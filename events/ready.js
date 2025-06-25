module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log('════════════════════════════════════════');
    console.log(` ✅ LDT Support is online as ${client.user.tag}`);
    console.log(` 📡 Connected to ${client.guilds.cache.size} server(s)`);
    console.log('════════════════════════════════════════');
  }
};
