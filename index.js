var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var routes = require('./routes.js');
var events = require('./events.js'); // socket events
var debug = require('debug')('checkers:app');
var fs = require('fs');
var Game = require('./lib/game.js');

global.games = [];

// add a set of debug games - TODO: remove
var utils = require('./lib/utils.js');
var parseGameFileString = utils.parseGameFileString;
for(var k = 1; k <= 10; k++) {
    var gamefile = "data/sampleCheckers" + k + ".txt";
    var data = fs.readFileSync(gamefile, 'utf8');
    
    var gameData = parseGameFileString(data);
    games.push(new Game(gameData, games.length));
}


// register middleware if any

// register routes
for(var route in routes)
{
    var routeObj = routes[route];
    app.get(route, function(req, res) {
        routeObj.handler(req, res);
    });
}

app.use(express.static('public'));

server.listen(4000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

io.on('connection', function(socket) {
    var event_groups = Object.keys(events);

    socket.on('disconnect', function() {
        debug('got a disconnect');
    });

    socket.on('error', function(err) {
        console.error("Error: ", err);
        console.error("stack: ", err.stack);
    });

    event_groups.forEach(function(eg) {
        var eg_obj = new events[eg]();
        var event_list = eg_obj.group_events();
        var gevents = Object.keys(event_list);

        gevents.forEach(function(e) {
            socket.on(e, function(data) {
                event_list[e].apply(eg_obj, [socket, data]);
            });
        });
    });
});

