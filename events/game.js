var constants = require('../constants.js').socket.events;
var Game = require('../lib/game.js');
var debug = require('debug')('checkers:events:game');

function GameEvents() {}

module.exports = GameEvents;

GameEvents.prototype.group_events = function() {
    var self = this;
    var events = {};
    
    events[constants.NEW_GAME] = self.new_game_handler;
    events[constants.GET_BOARD] = self.get_board_handler;

    return events;
}

GameEvents.prototype.new_game_handler = function(socket) {
    var gameId = games.length;
    
    debug("new game created: ", gameId);
    
    games.push(new Game());

    socket.emit(constants.GAME_ID, gameId);
}

GameEvents.prototype.get_board_handler = function(socket, gameId) {
    var game = games[gameId];
    
    debug("send board for game #", gameId);

    socket.emit(constants.BOARD_DATA, game ? game.board() : null);
}

