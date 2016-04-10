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
"You can lead a horse to water, but you can't make him drink",
"It's a small world",
"Over the hill",
"Put in my two cents",
"Make love, not war",
"An apple a day keeps the doctors away",
"April showers bring May flowers",
"Somewhere over the rainbow",
"The grass is always greener on the other side",
"You cannot open a book without learning.",
"Silence is a friend who never betrays",]

var gameStates = {};
app.use(bodyParser.json());
app.use(express.static(path.resolve("../frontend")));

app.get("/about", function(req, res) {
    res.sendFile("about.html", { root: __dirname + "/../frontend" });
});

//Actual game page
app.get("/[a-z]{4}\\\\?", function(req, res) {
    var game = get_url(req.url);
    if(!isCurrentGame(game))
        res.sendFile("nogame.html", { root: __dirname + "/../frontend" });
    else
        res.sendFile("game.html", { root: __dirname + "/../frontend" });
});

app.get("/[a-z]{4}/get_response.json", function(req, res) {
    var game = get_url(req.url);
    var id = req.query.num;
    var ret = {};
    if(id == -1) {
        ret["response"] = gameStates[game]["phrase"];
    } else {
        ret["response"] = gameStates[game]["players"][id]["response"];
    }
    res.send(JSON.stringify(ret));
});

app.get("/[a-z]{4}/get_players.json", function(req, res) {
    var game = get_url(req.url);
    var handles = [];
    gameStates[game]["players"].forEach(function(p) {
        handles.push(p["handle"]);
    });
    var ret = {
        "players" : handles
    };
    res.send(JSON.stringify(ret));
});

app.get("/[a-z]{4}/get_results.json", function(req, res) {
    var game = get_url(req.url);
    var ret = {
        "results" : gameStates[game]["players"],
        "phrase" : gameStates[game]["phrase"]
    }
    res.send(JSON.stringify(ret));
    gameStates[game]["deathCounter"]--;
    if(gameStates[game]["deathCounter"] == 0){
        removeGame(game); 
    }
});

app.get("/[a-z]{4}/get_turn.json", function(req, res) {
    var game = get_url(req.url);
    var ret = {
        "turn" : gameStates[game]["turn"]
    };
    res.send(JSON.stringify(ret));
});

app.get("/[a-z]{4}/get_maxPlayers.json", function(req, res) {
    var game = get_url(req.url);
    var ret = {
        "maxPlayers" : gameStates[game]["size"]
    };
    res.send(JSON.stringify(ret));
});

app.post("/request_room.json", function(req, res) {
    var size = req.body.size;
    var url = getRandomURL();
    gameStates[url] = {};
    gameStates[url]["turn"] = -1;
    gameStates[url]["phrase"] = getRandomPhrase();
    gameStates[url]["finished"] = false;
    gameStates[url]["size"] = size;
    gameStates[url]["num_players"] = 0;
    gameStates[url]["deathCounter"] = gameStates[url]["size"];
    gameStates[url].players = [];
    console.log(JSON.stringify(gameStates));
    var ret = {
        "url" : url
    };
    res.send(JSON.stringify(ret));
});

app.post("/[a-z]{4}/join", function(req, res) {
    var game = get_url(req.url);
    var handle = req.body.handle;
    var id = gameStates[game]["num_players"];
    gameStates[game]["players"][id] = {"handle" : handle};
    console.log("Player Joined: %s with id %d", handle, id);
    var ret = {
        "id" : id
    };
    res.send(ret)
    gameStates[game]["num_players"]++;
    
    if(gameStates[game]["num_players"] == gameStates[game]["size"]) {
        gameStates[game]["turn"] = 0;
    }
});

app.post("/[a-z]{4}/send_response", function(req, res) {
    var id = gameStates[game]["turn"];
    gameStates[game]["players"][id]["response"] = req.body.response;
    console.log("Revieved response from %d: %s", id, req.body.response);
    gameStates[game]["turn"]++;
    res.send({});
});

var removeGame = function(game) {
    gameStates[game] = null;
    delete gameStates[game];
    console.log("removed game: %s", game);
}

//returns
var isCurrentGame = function(game) {
    if(gameStates[game]) {
        return true;
    }
    return false;
}

var get_url = function(x) {
    var path = url.parse(x).pathname;
    return path.split("/")[1];
}

/*
 * Obtain a random string of four lowercase alpha characters.
 * Use intended for URL generation for a room.
 */
var getRandomURL = function() {
    var text = "";
    var possible = "abcdefghhijklmnopqrstuvwxyz";
    do{ 
        for (var i = 0; i < 4; ++i) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    }while(isCurrentGame(text));

    return text;
};

var getRandomPhrase = function() {
    return phrases[Math.floor(Math.random() * phrases.length)];
};

var server = app.listen(80, function() {
    console.log("Server started.");
});
