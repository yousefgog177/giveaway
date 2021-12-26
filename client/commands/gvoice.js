let ms = require('ms')
module.exports = {
	name: 'gvoice', // اسم الامر
	description: "new Give Away", // شرح الامر
	cooldown: 1, // الكول داون بـ الثواني
  usage: ["#gvoice 1h 1w [id-channel-voice]voi Nitro G", "#gvoice 1h [id-channel-voice]voi Nitro G"],		
execute: async function(client ,msg , args, db) {
if(!msg.member.permission.has("manageRoles")) return client.createMessage(msg.channel.id, `**Missing Permission**`)
let voice = ""
let winer = "1"
let timer = args[0]
let reason = args.slice(1).join(" ")

let data = await db.getguild({id: msg.channel.guild.id})
if(data.length < 1) data = [{
prefix: "#",
lang: "en",
id: msg.channel.guild.id,
emoji: "🎉"
}]

if(args[1] && args[1].includes('voi')){
let channel = msg.channel.guild.channels.get(args[1].replace('<#', '').replace('<#!', '').replace('>', '').replace('voi', ''))
if(!channel) return client.createMessage(msg.channel.id, `**I Can't Find This channel**`)
if(channel.type !== 2 && channel.type !== "2") return client.createMessage(msg.channel.id, `**Only Channel Voice!**`)
voice = channel.id
reason = args.slice(2).join(" ")

}
if(args[1] && args[1].includes('w')){
winer = args[1].replace('w', '')
reason = args.slice(2).join(" ")
}
if(args[2] && args[2].includes('w') ){
winer = args[1].replace('w', '')
reason = args.slice(3).join(" ")
}
if(args[2] && args[2].includes('voi')){
let channel = msg.channel.guild.channels.get(args[2].replace('<#', '').replace('<#!', '').replace('>', '').replace('voi', ''))
if(!channel) return client.createMessage(msg.channel.id, `**I Can't Find This channel**`)
if(channel.type !== 2 && channel.type !== "2") return client.createMessage(msg.channel.id, `**Only Channel Voice!**`)
voice = channel.id
reason = args.slice(3).join(" ")
}
console.log(`
Voice: ${voice}
winer: ${winer}
Reason: ${reason}
`)
if(!timer ||!reason || !voice || !winer) return client.createMessage(msg.channel.id, `**use: ${data[0].prefix}gvoice [winer]w [voice]voi [giveaway]**`)
if(winer.includes('.') || winer.includes('-') || winer.includes('e') || isNaN(Number(winer))) return client.createMessage(msg.channel.id, `Just Number`)
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
console.log(voice)
db.insertgiveaway({messageid: message.id, guild: message.channel.guild.id, time: time + Date.now(), reason: reason, winer: Number(winer), invites: 0, channel: message.channel.id, emoji: data[0].emoji, author: msg.author.id, blacklist: false, voice: voice})
message.addReaction(data[0].emoji).catch(err =>{
message.addReaction('🎉')
})
})
}

}