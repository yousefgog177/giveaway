const randomIdGenerator = require('random-id-generator')
                                                                                                                                                                                                                                                                                            
module.exports = {
	name: 'gend', // اسم الامر
	description: "For End Give away", // شرح الامر
	cooldown: 1, // الكول داون بـ الثواني
  usage: [],		
execute: async function(client ,msg , args, db) {

let data = await db.getguild({id: msg.channel.guild.id})
if(data.length < 1) data = [{
prefix: "#",
lang: "en",
id: msg.channel.guild.id,
blacklists: [],
emoji: "🎉"
}]
let rows = await db.getgiveaway({messageid: args[0]})
if(rows.length < 1) rows = await db.getgiveaway({guild: msg.channel.guild.id})
if(rows.length < 1) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'nogiveaways')) 
if(rows[0].guild !== msg.channel.guild.id){
let guild = client.guilds.get(rows[0].guild)
let member = guild.members.get(msg.author.id)
if(!member.permission.has("manageRoles")) return client.createMessage(msg.channel.id, `**You Don't Have Permission of ${guild.name}**`)
 return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'nogiveaways')) 
}else{
if(!msg.member.permission.has("manageRoles")) return client.createMessage(msg.channel.id, `**Missing Permission**`)
}
await db.edittime(rows[0].messageid, 1000)
return client.createMessage(msg.channel.id, `**Done 1-6s To End Giveaway**`)
},
};