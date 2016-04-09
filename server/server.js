var url = require("url");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var gameStates = {};
app.use(bodyParser.json());

//First page with url assignment
app.get("/", function(req, res) {
    game = "abcd";
    res.send("Your unique url is: ");
    gameStates[game] = {};
    console.log(JSON.stringify(gameStates));
});

//Actual game page
app.get("/*", function(req, res) {
    res.send("this is the game!");
});

app.get("/*/get_text", function(req, res) {
    var path = url.parse(req.url).pathname;
    var game = path.split("/")[1];
    res.send(gameStates[game]["text"]);
});

app.get("/*/get_emoji", function(req, res) {
    var path = url.parse(req.url).pathname;
    var game = path.split("/")[1];
    res.send(gameStates[game]["emoji"]);
});

app.get("/request_room.json", function(req, res) {
    res.send("{\"id:\"" +  getRandomURL() + "\"}");
});

app.post("/*/update_emoji", function(req, res) {
    var path = url.parse(req.url).pathname;
    console.log("update emoji from url: %s", path);
    var game = path.split("/")[1];
    console.log("game ID: %s", game);
    gameStates[game]["emoji"] = req.body.emoji;
    console.log(JSON.stringify(gameStates));
    res.send("Emoji updated\n");
});

app.post("/*/update_text", function(req, res) {
    var path = url.parse(req.url).pathname;
    console.log("update text from url: %s", path);
    var game = path.split("/")[1];
    console.log("game ID: %s", game);
    gameStates[game]["text"] = req.body.text;
    console.log(JSON.stringify(gameStates));
    res.send("Emoji updated\n");
});

/*
 * Obtain a random string of four lowercase alpha characters.
 * Use intended for URL generation for a room.
 */
var getRandomURL = function() {
    var text = "";
    var possible = "abcdefghhijklmnopqrstuvwxyz";
    
    for (var i = 0; i < 4; ++i) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

var server = app.listen(8081, function() {
    console.log("Server started.");
});
