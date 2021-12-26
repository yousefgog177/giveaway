const randomIdGenerator = require('random-id-generator')
                                                                                                                                                                                                                                                                                            
module.exports = {
	name: 'groll', // اسم الامر
	description: "Get One Random Winer", // شرح الامر
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
if(!args[0]) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'idmessage')) 
let rows = await db.getgiveaway({messageid: args[0]})
if(rows.length < 1) {
var able = true
client.getMessage(msg.channel.id, args[0]).catch(err =>{
able = false
}).then(message =>{
if(!able) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'icantfindthisgiveaway')) 
if(message.embeds.length < 1) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'icantfindthisgiveaway')) 
var ables = true
client.getMessageReaction(msg.channel.id, args[0], data[0].emoji).catch(err =>{
ables = false
}).then(async userss =>{
if(!ables) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'icantfindthisgiveaway')) 
let users = []
userss.forEach(async user =>{
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
let winers = []
let lengths = Math.floor(1)
if(1 >= users.length) lengths = users.length
let winerss = randomUser(users, lengths);
winerss.forEach(u =>{
winers.push(`<@${u}>`)
})
//console
if(winers.length < 1){
client.createMessage(msg.channel.id, `No valid entrants, so a winner could not be determined!
https://discordapp.com/channels/${message.channel.guild.id}/${message.channel.id}/${args[0]}`).catch(err =>{
})
}else{
client.createMessage(msg.channel.id, `Congratulations ${winers.join(',')}! You won the **${message.embeds[0].title}**!
https://discordapp.com/channels/${message.channel.guild.id}/${message.channel.id}/${args[0]}`).catch(err =>{
})
}
})
})
}else{
return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'giveawaynotend')) 
}

},
};