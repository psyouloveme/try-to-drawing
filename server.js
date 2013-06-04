var http = require("http");
var express = require('express');
var sockets = require("./sockets")



var ASSETS_DIR = "/assets";
var PUBLIC_DIR = "/public";
var PAINT_INDEX = "/index.html";
var PROD_PORT = 8080;
var DEV_PORT = 3000;

function startServer() {
    var app = express();
    var server = http.createServer(app);


    function logRequests(req, res, next){
        console.log('%s %s', req.method, req.url);
          next();
    }    
    app.use(express.logger());
    app.use(logRequests);


    app.get("/:id", function(req, res){
        console.log("got requ for id." + req.params.id);
        res.sendfile(__dirname + PUBLIC_DIR + PAINT_INDEX);
    });

    app.use("/assets", express.static(__dirname + ASSETS_DIR));
    console.log("using - " + __dirname + ASSETS_DIR);


    
    app.use("/", express.static(__dirname +  PUBLIC_DIR));
    console.log("using - " + __dirname + PUBLIC_DIR);

    
    app.configure('development', function(){
        server.listen(DEV_PORT);        
        app.use(express.errorHandler());
    });

    app.configure('production', function(){
        server.listen(PROD_PORT);
        app.use(express.errorHandler());
    });

    sockets.startListener(server);

    console.log("Server has started on port 3000.");
}

exports.startServer = startServer;