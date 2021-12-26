module.exports = {
	name: 'blacklist', // اسم الامر
	description: "Add/remove Blacklist", // شرح الامر
	cooldown: 1, // الكول داون بـ الثواني
  usage: ['blacklist add','blacklist remove'],	
execute: async function(client ,msg , args, db) {
let data = await db.getguild({id: msg.channel.guild.id})
if(data.length < 1) data = [{
prefix: "#",
lang: "en",
id: msg.channel.guild.id,
emoji: "🎉"
}]
if(!args[0]) return client.createMessage(msg.channel.id, `يرجي كتابة الامر مع التحديد 
${data[0].prefix}blacklist 'add','remove'`)
if(args[0] === 'add'){
let mentions = msg.mentions[0]
if(mentions) mentions = msg.mentions[0].id
if(!mentions) mentions = args[1]
var able = true
client.getRESTUser(mentions).catch(err =>{
able = false
}).then(async user =>{
if(!able) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'userdefind'))
if(data[0].blacklists.includes(user.id)) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'alreadyadd'))
let blacklists = [user.id]
data[0].blacklists.forEach(async users =>{
blacklists.unshift(users)
})
await db.updateguildarray(data[0].id, blacklists)

return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'doneadd'))
})
}
if(args[0] === 'remove'){
if(args[1] === "all"){
//return client.createMessage(msg.channel.id, "**This Command For Premium**")
await db.updateguildarray(data[0].id, [])
return client.createMessage(msg.channel.id, "**Done Delete all Blacklisted**")

}else{
let mentions = msg.mentions[0]
if(mentions) mentions = msg.mentions[0].id
if(!mentions) mentions = args[1]
var able = true
client.getRESTUser(mentions).catch(err =>{
able = false
}).then(async user =>{
if(!able) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'userdefind'))
if(!data[0].blacklists.includes(user.id)) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'alreadyremove'))
let blacklists = []
data[0].blacklists.forEach(users =>{
if(users !== user.id) blacklists.unshift(users)
})
await db.updateguildarray(data[0].id, blacklists)
return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'doneremoveuser'))
})
}
}
	},
};
