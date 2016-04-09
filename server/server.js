var express = require("express");
var app = express();

app.get("/", function(req, res) {
    res.send("test");
});

var server = app.listen(8081, function() {
    console.log("Server started.");
});
