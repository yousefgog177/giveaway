const express = require("express");
const bodyParser = require('body-parser');
const giveaway = require("./client/index.js")
const http = require('http')
const app = express();
const Eris = require('eris');


var server = http.createServer(app);

app.use(bodyParser.json());

var server = http.createServer(app);

const ws = require("ws")
var wss = new ws.Server({ server });

app.get("/", (request, response) => {
  response.send("OK");
});


let ms = require('ms')
app.use(bodyParser.json());
server.listen(3000)

giveaway()

