var constants = require('../constants.js').game;
var Board = require('./board.js');

function Game(userName)
{
    this._gameStatus = constants.status.STARTED;
    this._turn = constants.turn.P1;
    this._board = new Board();
    this._currentTurn = 0;
}

module.exports = Game;

Game.prototype.status = function(st) {
    if(st) this._gameStatus = st;
    return this._gameStatus;
}

Game.prototype.board = function(b) {
    if(b) this._board = b;
    return this._board.data();
}

Game.prototype.increment_turn = function() {
    this._currentTurn++;
}

