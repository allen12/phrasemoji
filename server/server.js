var url = require("url");
var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');

var app = express();
var phrases = ["There's no such thing as a free lunch", 
"The pen is mightier than the sword",
"Keep your friends close and your enemies closer",
"There's no place like home",
"The early bird catches the worm",
"Actions speak louder than words",
"Don't bite the hand that feeds you",
"There's no time like the present",
"A penny saved is a penny earned",
"You can't judge a book by its cover",
"Two heads are better than one",
"A chain is only as strong as its weakest link",
"You can lead a horse to water, but you can't make him drink"]

var gameStates = {};
app.use(bodyParser.json());
app.use(express.static(path.resolve("../frontend")));

//First page with url assignment
app.get("/", function(req, res) {
    //res.sendFile("/test.html");
});

//Actual game page
app.get("/[a-z]{4}\\\\?", function(req, res) {
    var path = url.parse(req.url).pathname;
    var game = path.split("/")[1];
    if (gameStates[game]["first_entered"]) {
    	res.sendFile("test2.html", { root: __dirname + "/../frontend" });
    } else {
    	res.sendFile("test.html", { root: __dirname + "/../frontend" });
    }
});

app.get("/[a-z]{4}/get_phrase.json", function(req, res) {
    var path = url.parse(req.url).pathname;
    var game = path.split("/")[1];
    var ret = {
        "phrase" : gameStates[game]["phrase"]
    };
    gameStates[game]["first_entered"] = true;
    res.send(JSON.stringify(ret));
});

app.get("/[a-z]{4}/get_text.json", function(req, res) {
    var path = url.parse(req.url).pathname;
    var game = path.split("/")[1];
    var ret = {
        "text" : gameStates[game]["text"]
    };
    res.send(JSON.stringify(ret));
});

app.get("/[a-z]{4}/get_emoji.json", function(req, res) {
    var path = url.parse(req.url).pathname;
    var game = path.split("/")[1];
    var ret = {
        "emoji" : gameStates[game]["emoji"]
    };
    res.send(JSON.stringify(ret));
});

app.get("/request_room.json", function(req, res) {
    var id = getRandomURL();
    gameStates[id] = {};
    gameStates[id]["phrase"] = getRandomPhrase();
    gameStates[id]["finished"] = false;
    gameStates[id]["first_entered"] = false;
    console.log(JSON.stringify(gameStates));
    var ret = {
        "id" : id
    };
    res.send(JSON.stringify(ret));
});

app.get("/[a-z]{4}/get_results.json", function(req, res) {
    var path = url.parse(req.url).pathname;
    var game = path.split("/")[1];
    res.send(JSON.stringify(gameStates[game]));
});

app.post("/[a-z]{4}/update_emoji", function(req, res) {
    var path = url.parse(req.url).pathname;
console.log(req);
console.log(res);
    console.log("update emoji from url: %s with ", path, req.body.emoji);
    var game = path.split("/")[1];
    console.log("game ID: %s", game);
    gameStates[game]["emoji"] = req.body.emoji;
    console.log(JSON.stringify(gameStates));
    res.send("Emoji updated\n");
});

app.post("/[a-z]{4}/update_text", function(req, res) {
    var path = url.parse(req.url).pathname;
    console.log("update text from url: %s", path);
    var game = path.split("/")[1];
    console.log("game ID: %s", game);
    gameStates[game]["text"] = req.body.text;
    gameStates[game]["finished"] = true;
    console.log(JSON.stringify(gameStates));
    res.send("Text updated\n");
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

var getRandomPhrase = function() {
    return phrases[Math.floor(Math.random() * phrases.length)];
};

var server = app.listen(80, function() {
    console.log("Server started.");
});
