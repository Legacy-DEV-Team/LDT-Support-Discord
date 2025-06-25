module.exports = { 
name: 'ready', 
once: true, 
execute(client) { 
console.log(` ✅ LDT Support is logged in as ${client.user.tag}`); 
}
};