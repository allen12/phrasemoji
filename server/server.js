var url = require("url");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var gameStates = {};
app.use(bodyParser.json());

app.get("/", function(req, res) {
    game = "abcd";
    res.send("Your unique url is: ");
    gameStates[game] = {};
    console.log(JSON.stringify(gameStates));
});

app.post("/*/update_emoji", function(req, res) {
    var path = url.parse(req.url).pathname;
    console.log("update emoji from url: %s", path);
    var game = path.split("/")[1];
    console.log("game ID: %s", game);
    console.log(req.body.emoji);
    gameStates[game]["emoji"] = req.body.emoji;
    console.log(JSON.stringify(gameStates));
});

app.post("/*/update_text", function(req, res) {
    
});

var server = app.listen(8081, function() {
    console.log("Server started.");
});
