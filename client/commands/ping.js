module.exports = {
	name: 'ping', // اسم الامر
	description: "", // شرح الامر
	cooldown: 1, // الكول داون بـ الثواني
  usage: [],	
execute: async function(client ,msg , args, db) {
client.createMessage(msg.channel.id, `pong`).then(msgs =>{
msgs.edit(`${msgs.timestamp - msg.timestamp}`)
})

	},
};
