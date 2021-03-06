var constants = require('../constants.js').socket.events;
var Game = require('../lib/game.js');
var debug = require('debug')('checkers:events:game');
var HumanPlayer = require('../lib/hplayer.js');

function GameEvents() {}

module.exports = GameEvents;

GameEvents.prototype.group_events = function() {
    var self = this;
    var events = {};
    
    events[constants.NEW_GAME] = self.new_game_handler;
    events[constants.GET_BOARD] = self.get_board_handler;
    events[constants.GET_MOVES] = self.get_moves_handler;
    events[constants.MAKE_MOVE] = self.make_move_handler;

    return events;
}

GameEvents.prototype.new_game_handler = function(socket) {
    var gameId = games.length;
    
    debug("new game created: ", gameId);
    
    // TODO: have AIs play for now
    // games.push(new Game( { P1 : new HumanPlayer() } ));
    games.push(new Game());

    socket.join(constants.GAME_ID);
    socket.emit(constants.GAME_ID, gameId);
}

GameEvents.prototype.get_board_handler = function(socket, gameId) {
    var game = games[gameId];
    
    debug("send board for game #", gameId);

    socket.join(gameId); // allow users to directly join game via copy paste url - ensure they are joined
    socket.to(gameId).emit(constants.BOARD_DATA, game ? game.board() : null);
    socket.emit(constants.BOARD_DATA, game ? game.board() : null);
}

GameEvents.prototype.get_moves_handler = function(socket, data) {
    var gameId = data.game_id;
    var game = games[gameId];
    var moves = game.get_available_moves_from_stp(data.x, data.y);
    
    debug("send available moves ", { given : data, moves : moves });

    socket.to(gameId).emit(constants.AVAIL_MOVES, moves);
    socket.emit(constants.AVAIL_MOVES, moves);
}

// TODO: hack - need better move planning than this
GameEvents.prototype.make_move_handler = function(socket, data) {
    var self = this;
    var gameId = data.game_id;
    var game = games[gameId];
    var turn, nextMove;
    
    debug("applying a move ", data);

    turn = game.turn();
    game.apply_move(data.move);
    this.get_board_handler(socket, gameId);

    nextMove = game.getNextPlayersMove();
    
    if(nextMove) {
        setTimeout(function() {
            data.move = nextMove;
            self.make_move_handler(socket, data);
        }, 500);
    }
}

