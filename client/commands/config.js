module.exports = {
	name: 'config', // اسم الامر
	description: "Add To User Blacklist and remove", // شرح الامر
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
emoji: "🎉",
dm: true
}]

if(args[0] === 'dm'){
if(!args[1]){

if(data[0].dm === true){
await db.updateguilddm(data[0].id, false)
return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'dmfalse'))
}
if(data[0].dm === false){
await db.updateguilddm(data[0].id, true)
return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'dmtrue'))
}

}else{
if(!Boolean(Boolean(args[1]))) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'falseortruejust'))
if(args[1] === false || args[1] === "false"){
await db.updateguilddm(data[0].id, false)
return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'dmfalse'))
}
if(args[1] === true || args[1] === "true"){
await db.updateguilddm(data[0].id, true)
return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'dmtrue'))
}
}

}

	},
};
