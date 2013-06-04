try-to-drawing
==============

a simple drawing app with nodejs, express3, and socketio

[(at least near) latest version running](http://squash.blackgreenlantern.com:8080)

disclaimer
----------

i'm new to javascript, nodejs, etc. (used here) and my html/css skills could use work.

how 2 use
---------

install:
- nodejs
- a web browser

run:
- clone it
- node index.js
- go to localhost:8080 (production) or localhost:3000 (development)

drawing:
- click on the info thing to dismiss it
- click/touch on the canvas to draw
- click/touch on a color to select it

rooms:
- go to localhost:8080 to get to the room '/'
- go to localhost:8080/ to get to the room '/'
- go to localhost:8080/what to get to room '/what'
- go to localhost:8080/global to get to the global room
- go to localhost:8080/rainbow to get to the rainbow room

references
----------

<cite>Martin Angelov. "Let’s Make a Drawing Game with Node.js" Tutorialzine. Tutorialzine, 21 August 2012. Web. 3 June 2013. &lt;[http://tutorialzine.com/2012/08/nodejs-drawing-game/](http://tutorialzine.com/2012/08/nodejs-drawing-game/)&gt;</cite>



originally based on [Let’s Make a Drawing Game with Node.js by Martin Angelov](http://tutorialzine.com/2012/08/nodejs-drawing-game/ "Let’s Make a Drawing Game with Node.js by Martin Angelov")


the tutorial there was pretty good, but way outdated by the time i saw it. i used it to get an understanding of how to use socket.io and for a refresher on javascript (it's been a long time). 

but i re-wrote from the ground up, removed most of the features and re-added them from scratch.

i don't css/html very well, so i did re-use a bit of that from the example. 
thanks
======