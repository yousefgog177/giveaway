const mongoose = require("mongoose")
let EventEmitter = require("events");

mongoose.connect("mongodb+srv://yousuf:41371755aa@giveaways.0dqqi.mongodb.net/giveaway" , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4
    });

const collection = mongoose.model("guildSettings", new mongoose.Schema({
            _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
            "id": { type: String } ,
            "prefix": { type: String, default: "#" },
            "lang": { type: String, default: "en" },
            "emoji": { type: String, default: "🎉" } ,
            "blacklists": { type: Array, default: [] } ,
            "dm": {type: Boolean, default: true }
}));
const giveaway = mongoose.model("giveaways", new mongoose.Schema({
            _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
            "messageid": { type: String } ,
            "guild": { type: String } ,
            "time": { type: Number } ,
            "reason": { type: String } ,
            "winer": { type: Number } ,
            "invites": { type: Number } ,
            "channel": { type: String } ,
            "emoji": { type: String } , 
            "author": { type: String } ,
            "blacklist": { type: Boolean },
            "voice": { type: String } 
}));

const mentions = mongoose.model("mentions", new mongoose.Schema({
            _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
            "id": { type: String } ,
            "guild": { type: String } ,
           "message": { type: String } ,
           "time": { type: Number, default: 3000 } ,

}))


    mongoose.connection.on('connected', async () =>{
      console.log('Mongoose has successfully connected!')

    });
    
    mongoose.connection.on('err', err => {
      console.error(`Mongoose connection error: \n${err.stack}`)
    });
    
    mongoose.connection.on('disconnected', () =>{
      console.warn('Mongoose connection lost')
    });

let lang = [{
use:{
ar: "استخدم: \n[prefix]gstart [وقت] [كم واحد بيفوز] [السبب]",
en: "use: \n[prefix]gstart [time] [winer] [reason]"
},
useblacklist:{
ar: "استخدم: \n[prefix]gblacklist [السبب]",
en: "use: \n[prefix]gblacklist [reason]"
},
time:{
en: "**i can't find this time or Max Time 2 week**",
ar: "**اكتب الوقت بشكل صحيح او الحد الاقصئ الا وقت اسبوعين**"
},
userdefind:{
en: "**I Can't Find This User**",
ar: "**لم استطع ايجاد هذا العضو**"
},
alreadyadd:{
en: "**This User Already Add!**",
ar: "**هذا العضو موجود بفعل**"
},
doneadd:{
en: "**Done Add This User!**",
ar: "**تم اضافة هذا العضو!**"
},
alreadyremove:{
en: "**This User Already Not Add!**",
ar: "**هذا العضو موجود غير موجود**"
},
doneremoveuser:{
en: "**Done Remove This User!**",
ar: "**تم ازالة هذا العضو!**"
},
channeldefind:{
en: "**I Can't Find This Channel**",
ar: "**لم استطع ايجاد هذا الروم**"
},
nomessage:{
en: "**I Can't Find Message**",
ar: "**قم بوضع الرسالة عند دخول شخص**"
},
donecreate:{
en: "**Done Add This Channel**",
ar: "**تم اضافة هذا الروم**"
},
alreadycreate:{
en: "**This Room Is Already Create**",
ar: "**هذا الروم بفعل موجود**"
},
nogiveaways:{
en: "**I Can't Find Any giveaway!**",
ar: "**هذا السيرفر لا يملك اي قيف اوي!**"
},
giveawaynotend:{
en: "**Can't roll and give away not end**",
ar: "**لا يمكنك اختيار فاز اخر الا عند انتهاء قيف اوي**"
},
idmessage:{
en: "**Request ID Message**",
ar: "**مطلوب ايدي رسالة**"
},
icantfindthisgiveaway:{
en: "**I Can't Find This GiveAway**",
ar: "**لم استطع ايجاد هذا القيف اوي**"
},
invsablegiveaway:{
en: "**Just Default Give away can roll**",
ar: "**فقط قيف اويات العادية تسطيع اختيار فائز اخر فيها**"
},
falseortruejust:{
en: "**Just True Or False**",
ar: "**فقط true او false**"
},
dmtrue:{
en: "**Send DM ON Now**",
ar: "**الارسال في خاص مفعل الان**"
},
dmfalse:{
en: "**Send DM OFF Now**",
ar: "**الارسال في خاص مغلق الان**"
},
prefix:{
en: "**Prefix Now Is [prefix]**",
ar: "**برفكس الان هو [prefix]**"
},
setprefix:{
en: "**Done Edit To [prefix]**",
ar: "**تم تعديل برفكس الا [prefix]**"
},
lang:{
en: "**Just en/englist/ar/arabic!**",
ar: "**لا يوجد غير en/englist/ar/arabic!**"
},
setlang:{
en: "**Done set lang!**",
ar: "**تم وضع هذا الغة بنجاح!**"
},
idontfindthis:{
en: "**I Can't find this room in data**",
ar: "**لم استطع ايجاد هذا الروم**"
},
doneremove:{
en: "**Done Remove This Room**",
ar: "**تم مسح هذا الروم**"
},
donedit:{
en: "**Done Edit Message**",
ar: "**تم تعديل الرسالة**"
}
}]
 class index extends EventEmitter {
constructor () {
  super  ()
}

async getguild(data){
return await collection.find(data)
}

async insertguild(data){
await new collection(data).save();
}
async getgiveaway(data){
return await giveaway.find(data)
}

async insertgiveaway(data){
return await new giveaway(data).save();
}

async deletegiveaway(data){
return await giveaway.deleteOne(data)
}

async updateguilddm(data, data2){
return await collection.updateOne({id: data}, {"dm": data2})
}
async updateguildprefix(data, data2){
return await collection.updateOne({id: data}, {"prefix": data2})
}
async updateguildlang(data, data2){
return await collection.updateOne({id: data}, {"lang": data2})
}

async updateguildarray(data, data2){
return await collection.updateOne({id: data}, {"blacklists": data2})
}
async edittime(data, data2){
return await giveaway.updateOne({messageid: data}, {"time": data2})
}

async insertmentions(data){
return await new mentions(data).save();
}
async updatementions(data, data2){
return await mentions.updateOne({id: data}, {"message": data2})
}
async getmentions(data){
return await mentions.find(data)
}
async deletemntions(data){
return await mentions.deleteOne(data)
}

lang(langs, command){
let langss = lang.find(d => d)
return langss[command][langs]
}

 }
module.exports = index