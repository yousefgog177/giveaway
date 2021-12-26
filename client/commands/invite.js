module.exports = {
	name: 'invite', // اسم الامر
	description: "Invite bot to you server", // شرح الامر
	cooldown: 1, // الكول داون بـ الثواني
  usage: [],	
execute: async function(client ,msg , args, db) {
client.createMessage(msg.channel.id, `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&permissions=2080374975&scope=bot\nhttps://discord.gg/4mnmMSaT`)

	},
};
