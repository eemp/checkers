var constants = require('../constants.js').game;
var directions = constants.board.directions;
var occupants = constants.board.occupants;
var Board = require('./board.js');
var Move = require('./move.js');
var debug = require('debug')('checkers:lib:game');

function Game(userName)
{
    this._gameStatus = constants.status.STARTED;
    this._turn = constants.turn.P1;
    this._board = new Board();
    this._turnCount = 0;
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
    this._turnCount++;
}

Game.prototype.get_available_moves_from_stp = function(x, y) { // accepts an optional starting point for human user
    var self = this;
    var board = this._board;
    var startingPiece = board.get(x, y);
    var isP1, isKing;
    var availableDirections, availableMoves;

    if(startingPiece == occupants.EMPTY) return [];

    isP1 = startingPiece % 2 == 0 ? false : true; 
    isKing = startingPiece > occupants.P2;
    availableDirections = isP1 ? [ directions.SE, directions.SW ] : [ directions.NE, directions.NW ];
    availableMoves = [];

    if(isKing) {
        availableDirections = [ directions.NE, directions.SE, directions.SW, directions.NW ];
    }
    
    // check distance 1
    for(var k = 0; k < availableDirections.length; k++) {
        var loc = board.getl(x, y, availableDirections[k], 1);
        var neighbor;
        if(loc) {
            debug("Board.get_available_moves_from_stp() : DEBUG : exploring ", loc);

            neighbor = board.get(loc[0], loc[1]);
            debug("Board.get_available_moves_from_stp() : DEBUG : found ", neighbor);

            if(neighbor == occupants.EMPTY){
                availableMoves.push(new Move({
                    from : [x, y],
                    to : loc
                }));
            }
        }
    }

    // if any occupied by opponent check dist 2

    debug("Board.get_available_moves_from_stp() : DEBUG : given ", { x : x, y : y });
    debug("Board.get_available_moves_from_stp() : DEBUG : got ", availableMoves);

    return availableMoves;
}

