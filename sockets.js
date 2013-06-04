var socketio = require("socket.io");
var io;
var logger;
var GLOBAL_ROOM = "/global";
var LAST_100 = {};
var COLORS = ["rgba(255,0,0,.50)",
              "rgba(255,128,0,.50)",
              "rgba(255,255,0,.50)",
              "rgba(0,255,0,.50)",
              "rgba(0,0,255,.50)",
              "rgba(70,0,130,.50)",
              "rgba(238,130,238,.50)"];

function logClick(room, data){
    if (! (LAST_100[room]) ){
        logger.debug("Creating list for " + room);
        LAST_100[room] = [];
    }
    if (LAST_100[room].length == 10000)
    {
        LAST_100[room].shift();
    }
    LAST_100[room].push({'x' : data.pageX,
                         'y' : data.pageY,
                         'fillStyle' : data.fillStyle});
}

function registerEvents(socket){
    //register onmousemove
    socket.on('canvasClick', function(data){
        logger.debug(">>>> Server RECIEVED canvasClick");

        if (data.room != GLOBAL_ROOM){
            logClick(data.room, data);
            socket.broadcast.to(data.room).emit('renderPoint', { "x" : data.pageX,
                                                           "y" : data.pageY,
                                                           "fillStyle" : data.fillStyle });
        }
        logClick(GLOBAL_ROOM, data);
        socket.broadcast.to(GLOBAL_ROOM).emit('renderPoint', { "x" : data.pageX,
                                                          "y" : data.pageY,
                                                          "fillStyle" : data.fillStyle});
    });

    socket.on("subscribe", function(data){
        socket.join(data.room);
        logger.info("user joined " + data.room);
        socket.emit('subscribed', {'usercount' : io.sockets.clients(data.room).length});
        drawLast100(data.room, socket);

    });

    socket.on("unsubscribe", function(data){
        socket.leave(data.room);
        logger.info("user left " + data.room);
    });
}

function drawLast100(room, socket){
    if ((LAST_100[room]) &&(room != "/rainbow")){
        var length = LAST_100[room].length;
        for (var i = 0; i < length; i++) {
              socket.emit('renderPoint', { "x" : LAST_100[room][i].x,
                                         "y" : LAST_100[room][i].y,
                                         "fillStyle" : LAST_100[room][i].fillStyle });    
        }
    } else if ((LAST_100[room]) && (room == "/rainbow")){
        var length = LAST_100[room].length,
            color = 0, 
            colorLength = COLORS.length;
        for (var i = 0; i < length; i++){
            if (color == colorLength){
                color = 0;
            } else {
                color = color+1;
            }
            socket.emit('renderPoint', { 'x' : LAST_100[room][i].x,
                                         'y' : LAST_100[room][i].y,
                                         'fillStyle' : COLORS[color]});
            console.log("Color should be: " + COLORS[color]);
        }
    }
}

function onConnection(socket) {
    logger.debug("user connected");
    //register events
    registerEvents(socket);    
    logger.debug("Callbacks registered");
}

function broadcastClear(){
    io.sockets.emit('clearCanvas');
    logger.info("<<<< Server EMMITTED clearCanvas");
    LAST_100 = {};

}

function startListener (server) {
    io = socketio.listen(server);
    io.configure('production', function(){
        io.set("log level", 1);
        setInterval(broadcastClear, 43200000);
    });
    io.configure('development', function(){
        io.set("log level", 3);    
        setInterval(broadcastClear, 1500000);
    });
    
    io.sockets.on('connection', onConnection);
    logger = io.log;
}

exports.startListener = startListener;
