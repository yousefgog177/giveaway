const randomIdGenerator = require('random-id-generator')
                                                                                                                                                                                                                                                                                            
module.exports = {
	name: 'gmention', // اسم الامر
	description: "mention new user join For channel", // شرح الامر
	cooldown: 1, // الكول داون بـ الثواني
  usage: [],	
execute: async function(client ,msg , args, db) {
if(!msg.member.permission.has("manageRoles")) return client.createMessage(msg.channel.id, `**Missing Permission**`)

let data = await db.getguild({id: msg.channel.guild.id})
if(data.length < 1) data = [{
prefix: "#",
lang: "en",
id: msg.channel.guild.id,
blacklists: [],
emoji: "🎉"
}]
if(!args[0]) return client.createMessage(msg.channel.id, `يرجي كتابة الامر مع التحديد 
${data[0].prefix}gmention 'create','remove','info'`)
let mentions = msg.channel.guild.channels.get(msg.channelMentions[0])
if(!mentions) mentions = msg.channel.guild.channels.get(args[1])
if(args[0] === "create"){
if(!mentions) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'channeldefind'))
if(!args[2]) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'nomessage'))
let rows = await db.getmentions({id: mentions.id})
if(rows.length < 1){
 client.createMessage(msg.channel.id, db.lang(data[0].lang, 'donecreate'))
await db.insertmentions({message: args.slice(2).join(" "), id: mentions.id, guild: msg.channel.guild.id})
}else{
 client.createMessage(msg.channel.id, db.lang(data[0].lang, 'alreadycreate'))
}
}
if(args[0] === "info"){
let rows = await db.getmentions({guild: msg.channel.guild.id})
let msgs = ``
for(const data of rows){
msgs = msgs + `\n===============
Channel: <#${data.id}> (${data.id})
Message: ${data.message}
===============`
}
client.createMessage(msg.channel.id, msgs || "This Server dont have any Gmention")
}
if(args[0] === 'edit'){
if(!mentions) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'channeldefind'))
if(!args[2]) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'nomessage'))

let rows = await db.getmentions({id: mentions.id})
if(rows.length < 1){
 client.createMessage(msg.channel.id, db.lang(data[0].lang, 'idontfindthis'))
}else{
await db.updatementions(mentions.id, args.slice(2).join(" "))
 client.createMessage(msg.channel.id, db.lang(data[0].lang, 'donedit'))
}
//mentions
}

if(args[0] === "remove"){
let rows = await db.getmentions({id: args[1].replace('<#', '').replace('<!#', '').replace('>', '')})
if(rows.length < 1){
 client.createMessage(msg.channel.id, db.lang(data[0].lang, 'idontfindthis'))
}else{
await db.deletemntions({id: rows[0].id})

 client.createMessage(msg.channel.id, db.lang(data[0].lang, 'doneremove'))
}
}

	},
};
