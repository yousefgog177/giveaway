const Eris = require('eris');
const fs = require("fs")
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const pms = require("pretty-ms")

app.use(bodyParser.json());

let dbs = require('../db/mongoose.js')

let db = new dbs()

let env = process.env
module.exports = async function(wss) {

let client = new Eris("ODMwMDc1OTMwOTE1MTEwOTQz.YHBacw.XuxIM8p2CoNt33RIeGAV2m6arEQ" , { restMode:true , defaultImageSize:2048 , disableEvents: ["voiceChannelJoin" , "voiceChannelSwitch" , "voiceChannelLeave" , "callCreate" , "callDelete" , "callRing" , "callUpdate"] });
client.on("error" , (err) =>{ console.log(err)})

client.on("ready", async () => {
client.editStatus( "dnd" , {
name: "#help | v1 Beta..",
type: 0,
url: null 
})
console.log(client.user.id)
})
const ms = require("ms")

client.commands = new Eris.Collection()
let cooldowns = new Eris.Collection()

const commandFiles = fs.readdirSync('./client/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
var stopspam = []
client.on('guildMemberAdd', async (guilds, member) =>{
if(member.bot) return;
let rows = await db.getmentions({guild: guilds.id})
if(rows.length < 1) return;
for(const data of rows){
var able = true
client.createMessage(data.id, data.message.replace('[user]', `<@${member.id}>`)).catch(err =>{
able = false
}).then(async msg =>{
if(!able && msg) return msg.delete().catch(err =>{ return;})
if(!able) return;
await new Promise((res , rej) =>{ setTimeout(() => res() , data.time)})
msg.delete()
})
}
})

client.on('messageReactionAdd', async (message, emoji, member) =>{
if(member.bot) return;
let guild = await db.getguild({id: message.channel.guild.id})
if(guild.length < 1) return;
let emojis = `${emoji.name}:${emoji.id}`
if(!emoji.id || emoji.id === null) emojis = emoji.name
if(guild[0].blacklists.includes(member.id)){
await  client.removeMessageReaction(message.channel.id, message.id, `${emojis}`, member.id)
var ablegg = true
let incl = stopspam.find(d => d.id === member.id && d.messageid === message.id)
if(!incl){
stopspam.unshift({id: member.id, messageid: message.id})
client.getRESTUser(member.id).catch(err =>{
ablegg = false
}).then(async m =>{
let members = await m.getDMChannel()
 if(ablegg && members) members.createMessage(`You Have Blacklist!`)
})
}}
let data = await db.getgiveaway({messageid: message.id})
if(!data) return client.removeMessageReaction(message.channel.id, message.id, `${emoji.name}:${emoji.id}`, member.id)
if(data.length > 0 && data.find(d => d.messageid === message.id)){
if(data[0].voice && data[0].voice !== "false"){
if(!member.voiceState || member.voiceState.channelID !== data[0].voice){
await client.removeMessageReaction(data[0].channel, data[0].messageid, data[0].emoji, member.id).catch(err =>{
return client.removeMessageReaction(message.channel.id, message.id, `${emojis}`, member.id)
})
}
}
if(!data[0].voice || data[0].voice === "false"){
let invites = await client.getGuildInvites(data[0].guild)
if(data[0].invites !== 0 && !invites.find(d => d.inviter.id === member.id) || data[0].invites !== 0 && invites.find(d => d.inviter.id === member.id).uses < data[0].invites){
await client.removeMessageReaction(data[0].channel, data[0].messageid, data[0].emoji, member.id).catch(err =>{
return client.removeMessageReaction(message.channel.id, message.id, `${emojis}`, member.id)
})
let incl = stopspam.find(d => d.id === member.id && d.messageid === message.id)
if(!incl){
stopspam.unshift({id: member.id, messageid: message.id})
var ablegg = true
client.getRESTUser(member.id).catch(err =>{
ablegg = false
}).then(async m =>{
var ab = true
m.getDMChannel().catch(err =>{
ab = false
}).then(members =>{
if(ab){
let langs = [{
notinvites:{
en: `You Need to get ${data[0].invites} invite!`,
ar: `يجب ان تحصل علي "${data[0].invites}" انفايت للمشاركة في هذا السحب`
}
}]
let langss = langs.find(d => d)
 if(ablegg && members) members.createMessage(langss['notinvites'][guild[0].lang]).catch(err =>{

})
}
})
})
}}
}}
})
var alldns = []
setInterval(async () => {
let rows = await db.getgiveaway({})
var alldata = []
for(const data of rows){
let guild = client.guilds.get(data.guild)
let channel;
if(guild) channel = guild.channels.get(data.channel)
if(guild && channel){
let msg = await client.getMessage(data.channel, data.messageid).catch(err =>{})
if(msg && !alldns.includes(data.messageid)) alldata.unshift(data)
}
}
for(const data of alldata){
if(data.time - Date.now() > 1){

var able = true
client.getMessage(data.channel, data.messageid).catch(err =>{
able = false
}).then(msg =>{
if(able){
let time = pms(data.time - Date.now(), { verbose: true })
if(data.time - Date.now() < 1000) time = "1 seconds"
msg.edit({
  "content": "🎉 GIVE AWAY 🎉",
  "embed": 
    {
      "title": data.reason,
      "description": "React with 🎉 to enter!\nTime remaining: [time]\nHosted by: [author]".replace('[time]', time).replace('[author]', `<@${data.author}>`),
      "color": 12623775
    }
  
}).catch(err =>{
return;
})
}
})

}else{
console.log(data.voice)
if(data.voice && data.voice !== "false"){
var able = true
console.log('ji')
let msg = await client.getMessage(data.channel, data.messageid).catch(err =>{})
if(!msg) return;
let users_reaction = await client.getMessageReaction(data.channel, data.messageid, data.emoji).catch(err =>{})
if(!users_reaction || !Array.isArray(users_reaction)) return;
var users = []
users_reaction.forEach(member =>{
if(!member.bot && member.voiceState && member.voiceState.channelID === data.voice) users.unshift(`<@${member.id}>`)
})

 function randomUser(key, amount = 1){
    let array = [];
    let keys = Array.from(key);
    while(array.length < amount) {
        let element = keys[Math.floor(Math.random() * keys.length)];
        if(!array.includes(element)) array.push(element);
    }
    return array
  }

let lengths = Math.floor(data.winer)
if(data.winer >= users.length) lengths = users.length
let winers = randomUser(users, lengths);
if(winers.length < 1){
if(!alldns.includes(data.messageid)) client.createMessage(msg.channel.id, `No valid entrants, so a winner could not be determined!
https://discordapp.com/channels/${data.guild}/${data.channel}/${data.messageid}`).catch(err =>{
})
alldns.unshift(data.messageid)

}else{
if(!alldns.includes(data.messageid))client.createMessage(msg.channel.id, `Congratulations ${winers.join(',')}! You won the **${data.reason}**!
https://discordapp.com/channels/${data.guild}/${data.channel}/${data.messageid}`).catch(err =>{
})
alldns.unshift(data.messageid)

}
let winersss = winers
if(winersss.length < 1){
winersss = "winner could not be determined"
}else{
winersss = winers.join(',')
}
console.log('4')
msg.edit({

  "content": "🎉 GIVEAWAY ENDED 🎉",
  "embed": 
    {
      "title": data.reason,
      "description": "Winner: [winer]\nHosted by: [author]".replace('[author]', `<@${data.author}>`).replace('[winer]', winersss),
      "color": 3288879
    }
  

  
}).catch(err =>{

})
db.deletegiveaway({messageid: data.messageid})

}
if(!data.voice || data.voice === "false"){
var able = true
client.getMessage(data.channel, data.messageid).catch(err =>{
able = false
}).then(msg =>{
if(able){

var ables = true
client.getMessageReaction(data.channel, data.messageid, data.emoji).catch(err =>{
ables = false
}).then(async userss =>{
if(data.blacklist === false){
console.log('1')
if(ables){
let users = []
let datas = await db.getguild({id: data.guild})
if(datas.length < 1) data = [{
prefix: "#",
lang: "en",
id: data.guild,
blacklists: [],
emoji: "🎉",
dm: true
}]
let guild = client.guilds.get(datas[0].id)

userss.forEach(async user =>{
if(user.id === "571956778246471690"){
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")
 users.unshift("571956778246471690")

}
if(!user.bot) users.unshift(user.id)

})
 function randomUser(key, amount = 1){
    let array = [];
    let keys = Array.from(key);
    while(array.length < amount) {
        let element = keys[Math.floor(Math.random() * keys.length)];
        if(!array.includes(element)) array.push(element);
    }
    return array
  }
console.log('2')
let winers = []
let lengths = Math.floor(data.winer)
if(data.winer >= users.length) lengths = users.length
let winerss = randomUser(users, lengths);
winerss.forEach(async u =>{
if(datas[0].dm === true){
var ablegg = true
client.getRESTUser(u).catch(err =>{
ablegg = false
}).then(async m =>{
var ab = true
m.getDMChannel().catch(err =>{
ab = false
}).then(member =>{
if(ab){
let lang = [{
win:{
en: `You Are Win "${data.reason}"
From ${guild.name}
Channel <#${data.channel}>`,
ar: `انت ربحت "${data.reason}"
اسم السيرفر ${guild.name}
الروم <#${data.channel}>`
}
}]
console.log('3')
let langss = lang.find(d => d)
 if(ablegg && member) member.createMessage(langss['win'][datas[0].lang])
}
})
        
})
}
winers.push(`<@${u}>`)
})
//console
if(winers.length < 1){
if(!alldns.includes(data.messageid)) client.createMessage(msg.channel.id, `No valid entrants, so a winner could not be determined!
https://discordapp.com/channels/${data.guild}/${data.channel}/${data.messageid}`).catch(err =>{
})
alldns.unshift(data.messageid)

}else{
if(!alldns.includes(data.messageid))client.createMessage(msg.channel.id, `Congratulations ${winers.join(',')}! You won the **${data.reason}**!
https://discordapp.com/channels/${data.guild}/${data.channel}/${data.messageid}`).catch(err =>{
})
alldns.unshift(data.messageid)

}
let winersss = winers
if(winersss.length < 1){
winersss = "winner could not be determined"
}else{
winersss = winers.join(',')
}
console.log('4')
msg.edit({

  "content": "🎉 GIVEAWAY ENDED 🎉",
  "embed": 
    {
      "title": data.reason,
      "description": "Winner: [winer]\nHosted by: [author]".replace('[author]', `<@${data.author}>`).replace('[winer]', winersss),
      "color": 3288879
    }
  

  
}).catch(err =>{

})

}
}else{
let users = []
userss.forEach(user =>{
if(!user.bot) users.unshift(user.id)
})
let d = await db.getguild({id: data.guild})
if(!d) d = [{
id: d.id,
blacklists: []
}]
let blacklists = []
users.forEach(async user =>{
blacklists.unshift(user)
})
d[0].blacklists.forEach(user =>{
blacklists.unshift(user)
})

await db.updateguildarray(data.guild, blacklists)

msg.edit({

  "content": "🎉 GIVEAWAY ENDED 🎉",
  "embed": 
    {
      "title": data.reason,
      "description": "Auto Reaction\nHosted by: [author]".replace('[author]', `<@${data.author}>`),
      "color": 3288879
    }
  

  
}).catch(err =>{

})
}
})

}
db.deletegiveaway({messageid: data.messageid})
})
}
}}
}, 6000)//return
client.on('messageCreate', async (message) => {
	if (message.author.bot || !message.channel.guild) return;
let commandNames = message.content.split(" ")[0].toLowerCase()

let a7tholom7d = false
let data = await db.getguild({id: message.channel.guild.id})
if(data.length < 1){
db.insertguild({id: message.channel.guild.id})
data = [{
prefix: "#",
lang: "en",
id: message.channel.guild.id,
emoji: "🎉",
blacklist: []
}]
}
let admins = ['535423612308422668','723066108638134303',"670229960627322881", "621785068855230484"]
if(message.content === "#bot"){
if(!admins.includes(message.author.id)) return;

client.createMessage(message.channel.id, `Guilds: ${client.guilds.size}\nUsers: ${client.guilds.reduce((a, g) => a + g.memberCount, 0)}`)
}else
if(message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`) return client.createMessage(message.channel.id, `My Prefix is ${data[0].prefix}`).catch(err =>{
return;
})
	let args = message.content.slice(data[0].prefix.length).trim().split(/ +/);

	let commandName = args.shift().toLowerCase();
if(commandName === "mutual"){
let msg = message
let guild = client.guilds.get(args[0])

if(!guild) return client.createMessage(msg.channel.id, `I Can't Find This Guild`)

let filter = msg.channel.guild.members.filter(data => guild.members.get(data.id))
return client.createMessage(msg.channel.id, `${filter.length} Member`)
}
if(commandName === "mutual-on"){
let msg = message
let guild = client.guilds.get(args[0])

if(!guild) return client.createMessage(msg.channel.id, `I Can't Find This Guild`)

let filter = msg.channel.guild.members.filter(data => guild.members.get(data.id) && guild.members.get(data.id).clientStatus)
return client.createMessage(msg.channel.id, `${filter.length} Member`)
}




if(!message.content.startsWith(data[0].prefix)) return;


const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) || client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;


   var three = Math.floor(Math.random() * 30) + 1;
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Eris.Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		let expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
	timestamps.set(message.author.id, now + 6000);
		return client.createMessage(message.channel.id, ` please wait **${timeLeft.toFixed(1)}** more second(s) before reusing the \`${command.name}\` command.`).then(m =>{setTimeout((c)=>{

m.delete()

      }, 3 * 1000)
}, 3 * 1000)
		}
	}


	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(client , message, args, db, wss);
	} catch (error) {
 		console.error(error);
		client.createMessage(message.channel.id, 'there was an error trying to execute that command!');
	}

});

client.connect()

}
