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
    events[constants.GET_MOVES] = self.get_moves_handler;

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

GameEvents.prototype.get_moves_handler = function(socket, data) {
    var gameId = data.game_id;
    var game = games[gameId];
    var moves = game.get_available_moves_from_stp(data.x, data.y);
    
    debug("send available moves ", { given : data, moves : moves });

    socket.emit(constants.AVAIL_MOVES, moves);
}

