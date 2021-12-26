let ms = require('ms')
module.exports = {
	name: 'gblacklist', // اسم الامر
	description: "new Give Away For Blacklist", // شرح الامر
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
let winer = 1
let reason = args.slice(0).join(" ")
let invites = 0
if(!args[0]) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'useblacklist').replace('[prefix]', data[0].prefix))

let time = ms('30s')
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
db.insertgiveaway({messageid: message.id, guild: message.channel.guild.id, time: time + Date.now(), reason: reason, winer: winer, invites: invites, channel: message.channel.id, emoji: data[0].emoji, author: msg.author.id, blacklist: true, voice: false})
message.addReaction(data[0].emoji).catch(err =>{
message.addReaction('🎉')
})
})
	},
};
