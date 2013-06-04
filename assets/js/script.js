$(function(){

    //var SERVER_URL = "http://:3000";
    var SERVER_URL = document.URL.slice(0, document.URL.lastIndexOf(":"));
    var SERVER_PORT = document.URL.slice(document.URL.lastIndexOf(":"),
                                         document.URL.lastIndexOf("/"));
    var SERVER = SERVER_URL+SERVER_PORT;
    console.log("USING SERVER: " + SERVER);
    var THISCLIENT = Math.round($.now()*Math.random());
    var COLORS = ["rgba(255,0,0,.75)",
                  "rgba(255,128,0,.75)",
                  "rgba(255,255,0,.75)",
                  "rgba(0,255,0,.75)",
                  "rgba(0,0,255,.75)",
                  "rgba(70,0,130,.75)",
                  "rgba(238,130,238,.75)",
                  "rgba(0,0,0,.75)",
                  "rgba(255,255,255,1)"];
    var BLACK = COLORS.length;

    console.log("The url is: " + SERVER);
    // console.log("split url length is " + split_url.length);
    // console.log("split url is " + split_url.toString());

    function environment(){
        // this.$doc = $(document);
        this.$doc = $(document);
        this.$win = $(window);
        // this.$win = $(window);
        this.$canvas = $('#paper');
        this.$instructions = $("#instructions");

        this.canvasElement = this.$canvas[0];
        this.ctx = this.canvasElement.getContext('2d');
        // this.ctx.globalAlpha = 0.75;
        this.ctx.globalCompositeOperation = "source-over";
        // Color Changing
        //this.ctx.fillStyle = "#FF1D46";
        this.socket = io.connect(SERVER);
        this.id  = Math.round($.now()*Math.random());
        this.clients = [];
        this.mouseIsDown = false;
        this.currentColor = BLACK;
        this.drawing = false;
        //console.log("split indedx is " + split);
        this.room = document.URL.slice(document.URL.lastIndexOf("/"), 
                                       document.URL.length);
        console.log(this.room);
        // this.cursor = $('<div class="cursor"/>').appendTo('#cursors');

        console.log("Going to join room " + this.room);
    }

    var env = new environment();
    
    function registerCallbacks(){
        env.socket.on("connect", onSocketConnect);
        env.socket.on("disconnect", onDisconnect);
        env.socket.on("clearCanvas", onClearCanvas);
        env.socket.on("renderPoint", onRenderPoint);
        env.socket.on("subscribed", onSubscribed);
        env.canvasElement.addEventListener("touchstart", onTouch, false);
        env.canvasElement.addEventListener('touchmove', onTouch, false);
        env.canvasElement.addEventListener('touchend', onTouch, false);
        env.$canvas.mouseup(onMouseUp);
        env.$canvas.mousedown(onMouseDown);
        env.$canvas.mouseover(onMouseEnter);
        env.$canvas.mouseenter(onMouseEnter);
        env.$canvas.mouseleave(onMouseLeave);
        env.$canvas.mouseout(onMouseLeave);
        env.$canvas.mousemove(onMouseMove);
        env.$instructions.mousedown(function(){
            env.$instructions.fadeOut();
        });

        // //env.cursor.on('mouseout', forwardCursorEvent);
        // env.cursor.on('mousemove', onMouseMove);
        // env.cursor.on('mouseover', enterCursor);
        // env.cursor.on('mousedown', onMouseDown);
        // env.cursor.on('mousemove', onMouseMove);
        // env.cursor.on('mouseup', onMouseUp);
        
        env.$doc.keypress(onKeyPress);
    }    

    function createInfo(){
        $thisRoom = $("<h3>").appendTo(env.$instructions);
        $thisRoom.text("welcome to " + env.room);
    }

    function createToolBar(){
        $toolbar = $("#tools");
        $colorpicker = $("<table id='colorpicker'>");
        $aTr = $("<tr>").appendTo($colorpicker);
        for (var x = 0; x < COLORS.length; x++){

            $aTd = $("<td class='color' name='color" + x + "'>").appendTo($aTr);
            $aTd.css("background-color", COLORS[x]);
            $aTd.mousedown({'theColor' : x}, function (data){
                env.currentColor = data.data.theColor;
                console.log("clicked " + data.data.theColor);
            });

            if (((x % 2) == 0) && (x != COLORS.length -1)){
                $aTr = $("<tr>").appendTo($colorpicker);
            }
        }
        // if (x % 2 != 0 ){
        //     $aTd = $("<td class='color'>").appendTo($aTr);
        //     $aTd.css("border", "none");
        // }
        $colorpicker.appendTo($toolbar)

    }

    function onDocReady(){
        registerCallbacks();
        createInfo();
        createToolBar();
        console.debug("Loading complete.");
    }
    
    // function moveCursor(data){
    //     env.cursor.css("background-color" , COLORS[env.currentColor]);
    //     env.cursor.css("top", data.pageY + "px");
    //     env.cursor.css("left", data.pageX + "px");
    // }
    
    function onSubscribed(data){
        $users = $("<h3>");
        $users.text(data.usercount + " users here.")
        env.$instructions.append($users);
    }

    function onSocketConnect(){
        env.socket.emit("subscribe", { 'room' : env.room});
        console.debug("<<<< socket EMMITTED subscribe");

    }

    function onClearCanvas(e){
        console.debug(">>>> socket RECIEVED clearCanvas");
        console.debug("Clearing canvas");
        env.$canvas.width = env.$canvas.width;
        //env.ctx.clearRect(0,0, env.$canvas.height, env.$canvas.width);

    }
    function drawPoint(pointData){
        var oldFillStye = env.ctx.fillStyle;
        env.ctx.fillStyle = pointData.fillStyle;
        env.ctx.fillRect(pointData.x-5, pointData.y-5, 10, 10);
        env.ctx.fillStyle = oldFillStye;
    }

    function onTouch(touchData){
        touchData.preventDefault();
        console.debug(touchData.type);
        for (var i = 0; i < touchData.targetTouches.length; i++){
            var tmp = touchData.targetTouches.item(i);

            env.socket.emit('canvasClick', { "pageX" : tmp.pageX, 
                                             "pageY" : tmp.pageY,
                                             "fillStyle" : COLORS[env.currentColor],
                                             "room"  : env.room });
        drawPoint({ "x" : tmp.pageX,
                    "y" : tmp.pageY,
                    "fillStyle" : COLORS[env.currentColor] });
        }
        console.debug("<<<< socket EMMITTED touchstart");
    }

    function onDisconnect(){
        env.socket.emit("unsubscribe", { 'room' : env.room});
        console.debug("<<<< socket EMMITTED unsubscribe");

    }

    function onKeyPress(keyData){
        var length = COLORS.length-1;
        
        if ((keyData.keyCode == 65) || (keyData.keyCode == 97)){
            if (length == env.currentColor){
                env.currentColor = 0;
            }
            else {
                env.currentColor += 1;
            }
            // env.cursor.css("background", COLORS[env.currentColor]);
        }
    }

    function onRenderPoint(coord){
        console.debug(">>>> socket RECIEVED renderPoint");
        drawPoint(coord);
    }

    function onMouseEnter(data){
        // moveCursor(data);
        // env.cursor.show();
    }

    function onMouseDown(clickData){
        console.debug(">>>> Canvas RECIEVED mousedown");
        env.mouseIsDown = true;
        env.drawing = true;
        env.socket.emit('canvasClick', { "pageX" : clickData.pageX, 
                                         "pageY" : clickData.pageY,
                                         "fillStyle" : COLORS[env.currentColor],
                                         "room"  : env.room });
        drawPoint({ "x" : clickData.pageX,
                    "y" : clickData.pageY,
                    "fillStyle" : COLORS[env.currentColor]});
        
        console.debug("<<<< socket EMMITTED canvasClick");
    }

    function onMouseMove(clickData){
        // moveCursor(clickData);
        if (env.drawing == true){
            env.socket.emit('canvasClick', { "pageX" : clickData.pageX, 
                                             "pageY" : clickData.pageY,
                                             "fillStyle" : COLORS[env.currentColor],
                                             "room"  : env.room });
            drawPoint({ "x" : clickData.pageX,
                        "y" : clickData.pageY,
                        "fillStyle" : COLORS[env.currentColor]});
            console.debug("<<<< socket EMMITTED canvasClick");
        }
    }

    function onMouseLeave(data){
        env.drawing = false;
        // env.cursor.hide();
    }

    function onMouseUp(data){
        env.mouseIsDown = false;
        env.drawing = false;
    }

    // function enterCursor(data){
    //     if (env.mouseIsDown == true){
    //         env.drawing = true;
    //     }
    // }

    env.$doc.ready(onDocReady);



})