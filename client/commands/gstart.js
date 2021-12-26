let ms = require('ms')
module.exports = {
	name: 'gstart', // اسم الامر
	description: "new Give Away", // شرح الامر
	cooldown: 1, // الكول داون بـ الثواني
  usage: ["#gstart 1h 10w 1inv x10 Nitro G" , "#gstart 1h 10w x10 Nitro G" , "#gstart 1h Nitro G"],		
execute: async function(client ,msg , args, db) {
if(!msg.member.permission.has("manageRoles")) return client.createMessage(msg.channel.id, `**Missing Permission**`)

let data = await db.getguild({id: msg.channel.guild.id})
if(data.length < 1) data = [{
prefix: "#",
lang: "en",
id: msg.channel.guild.id,
emoji: "🎉"
}]

if(!args[0] || !args[1]) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'use').replace('[prefix]', data[0].prefix))
let reason = args.slice(3).join(" ")
let winer = "1"
let invites = "0"
if(!args[1].includes('w') || !args[1].includes('inv')){
reason = args.slice(1).join(" ")
}
if(args[1].includes('inv')){
reason = args.slice(2).join(" ")
invites = args[1].replace('inv', '')
}
if(args[1].includes('w')){
reason = args.slice(2).join(" ")
winer = args[1].replace('w', '')
}
if(args[1].includes('w') && args[2] && args[2].includes('inv')){
reason = args.slice(3).join(" ")
winer = args[2].replace('w', '')
invites = args[1].replace('inv', '')
}
if(args[2] && args[2].includes('inv') && args[1].includes('w')){
reason = args.slice(3).join(" ")
winer = args[1].replace('w', '')
invites = args[2].replace('inv', '')
}

//let winer = args[1].replace('w', '')
//let invites = args[2].replace('inv', '')

if(winer.includes('.') || winer.includes('-') || winer.includes('e') || isNaN(Number(winer))) return client.createMessage(msg.channel.id, `Just Number`)
if(invites.includes('.') || invites.includes('-') || invites.includes('e') || isNaN(Number(invites))) return client.createMessage(msg.channel.id, `Just Number`)

let time = ms(args[0])
if(!time) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'time'))
if(time > 1209600033) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'time'))
client.createMessage(msg.channel.id, {
  "content": "🎉 GIVE AWAY 🎉",
  "embed": 
    {
      "title": reason,
      "description": "React with 🎉 to enter!\nTime remaining: [time]\nHosted by: [author]".replace('[time]', ms(time, { long: true })  ).replace('[author]', `<@${msg.author.id}>`),
      "color": 12623775
    }
  
}).then(message =>{
msg.delete()
db.insertgiveaway({messageid: message.id, guild: message.channel.guild.id, time: time + Date.now(), reason: reason, winer: winer, invites: invites, channel: message.channel.id, emoji: data[0].emoji, author: msg.author.id, blacklist: false, voice: false})
message.addReaction(data[0].emoji).catch(err =>{
message.addReaction('🎉')
})
})
	},
};
