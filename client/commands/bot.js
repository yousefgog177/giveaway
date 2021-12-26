module.exports = {
	name: 'bot', // اسم الامر
	description: "Edit Server Setting", // شرح الامر
	cooldown: 1, // الكول داون بـ الثواني
  usage: ['set prefix','set lang'],	
execute: async function(client ,msg , args, db) {
let data = await db.getguild({id: msg.channel.guild.id})
if(data.length < 1) data = [{
prefix: "#",
lang: "en",
id: msg.channel.guild.id,
emoji: "🎉"
}]
if(args[0] === "prefix"){
await db.updateguildprefix(data[0].id, args[1] || "#")
if(!args[1]) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'prefix').replace('[prefix]', args[1] || "#"))
return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'setprefix').replace('[prefix]', args[1] || "#"))
}
if(args[0] === "lang"){
let langs = ['ar','arabic','en','english']
if(!langs.includes(args[1])) return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'lang').replace('[lang]', args[1]))
await db.updateguildlang(data[0].id, args[1])
return client.createMessage(msg.channel.id, db.lang(data[0].lang, 'setlang').replace('[lang]', args[1]))
}
	},
};
