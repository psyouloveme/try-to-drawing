
exports.onTouch = function (touchData){
        touchData.preventDefault();
        console.debug(touchData.type);
        for (var i = 0; i < touchData.targetTouches.length; i++){
            var tmp = touchData.targetTouches.item(i);

            touchData.data.socket.emit('canvasClick', { "pageX" : tmp.pageX, 
                                             "pageY" : tmp.pageY,
                                             "fillStyle" : COLORS[env.currentColor],
                                             "room"  : env.room });
            drawPoint({ "x" : tmp.pageX,
                        "y" : tmp.pageY,
                        "fillStyle" : COLORS[env.currentColor],
                        "ctx" : touchData.data.ctx });
        }
        console.debug("<<<< socket EMMITTED touchstart");
    };

exports.onMouseUp = function (data){
        env.mouseIsDown = false;
    };

exports.onMouseDown = function (clickData){
        console.debug(">>>> Canvas RECIEVED mousedown");
        env.mouseIsDown = true;
        clickData.data.socket.emit('canvasClick', { "pageX" : clickData.pageX, 
                                         "pageY" : clickData.pageY,
                                         "fillStyle" : COLORS[env.currentColor],
                                         "room"  : env.room });
        drawPoint({ "x" : clickData.pageX,
                    "y" : clickData.pageY,
                    "fillStyle" : COLORS[env.currentColor]});
        console.debug("<<<< socket EMMITTED canvasClick");
    };

exports.onMouseMove = function (clickData){
        console.log("Got mousemove");
        moveCursor(clickData);
        if (env.mouseIsDown == true){
            clickData.data.socket.emit('canvasClick', { "pageX" : clickData.pageX, 
                                             "pageY" : clickData.pageY,
                                             "fillStyle" : COLORS[env.currentColor],
                                             "room"  : env.room });
            drawPoint({ "x" : clickData.pageX,
                        "y" : clickData.pageY,
                        "fillStyle" : COLORS[env.currentColor],
                        "ctx" : clickData.data.ctx });
            console.debug("<<<< socket EMMITTED canvasClick");
        }
    };

exports.onMouseLeave = function (data){
        env.mouseIsDown = false;
        env.cursor.style.visibility = "hidden";
    };

exports.onMouseEnter = function (data){
        data.data.moveFunc(data);
        data.data.cursor.style.visibility = "visible";
    };