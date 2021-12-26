module.exports = {
	name: 'help', // اسم الامر
	description: "Help For Commands", // شرح الامر
	cooldown: 1, // الكول داون بـ الثواني
  usage: [],		
execute: async function(client ,msg , args, db) {
var command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
if(!command) {
let data = await db.getguild({id: msg.channel.guild.id})
if(data.length < 1) data = [{
prefix: "#",
lang: "en",
id: msg.channel.guild.id,
emoji: "🎉"
}]
client.createMessage(msg.channel.id,{
  "content": "قائمة المساعدة",
  "embed": 
    {
      "title": "ما هو \"قيف اواي روبوت\" ؟",
      "description": "هو روبوت يصنع سحب علي جائزة انت تحددها ب الوقت اللي انت تحدده و فيه كثير من مميزات مثل :",
      "url": "https://discord.gg/4mnmMSaT",
      "color": 5814783,
      "fields": [
        {
          "name": "الاوآمر العامة",
          "value": "${prefix}help , ${prefix}ping , ${prefix}invite".split("${prefix}").join(data[0].prefix)

        },
        {
          "name": "اوامر السحب",
          "value": "${prefix}gstart , ${prefix}gend , ${prefix}groll , ${prefix}gblacklist".split("${prefix}").join(data[0].prefix)
        },
        {
          "name": "اوامر قائمة السودة",
          "value": "${prefix}blacklist remove, ${prefix}blacklist add".split("${prefix}").join(data[0].prefix)
        },
        {
          "name": "اوامر تنظيم البوت",
          "value": "${prefix}bot prefix , ${prefix}bot lang , ${prefix}config dm".split("${prefix}").join(data[0].prefix)
        },
        {
          "name": "اوامر البريميوم",
          "value": "${prefix}gmention , ${prefix}bot avatar , ${prefix}bot username , ${prefix}bot status , ${prefix}bot information , ${prefix}bot transfer".split("${prefix}").join(data[0].prefix)
        }
      ],
      "author": {
        "name": client.user.username,
        "url": client.user.avatarURL
      },
      "footer": {
        "text": "لأظهار فائدة امر معين : \n${prefix}help (command)".split("${prefix}").join(data[0].prefix)
      }
    }
  
})

}else{
client.createMessage(msg.channel.id, {
  "embed": 
    {
      "title": "Command: [command.name]".replace('[command.name]', command.name),
      "description": "[command.description]".replace('[command.description]', command.description),
      "color": 966106,
      "fields": [
        {
          "name": "Usage",
          "value": "[command.usage]".replace('[command.usage]', command.usage.join('\n') || "none") 
        },
        {
          "name": "Cooldown",
          "value": "[command.cooldown]".replace('[command.cooldown]', command.cooldown)
        }
      ]
    }
  
})
}
	},
};
