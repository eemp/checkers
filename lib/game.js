var constants = require('../constants.js').game;
var directions = constants.board.directions;
var occupants = constants.board.occupants;
var Board = require('./board.js');
var Move = require('./move.js');
var debug = require('debug')('checkers:lib:game');

/* some utils functions */
function getPlayerFromPiece(piece) {
    return (piece % 2) + 1;
}

function Game(bdata, turn)
{
    this._gameStatus = constants.status.STARTED;
    this._turn = turn || constants.turn.P1;
    this._board = new Board(bdata);
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

Game.prototype.apply_move = function(move_info) {
    var self = this;

    var from = move_info._from;
    var to = move_info._to;
    var jump = move_info._jump;

    var occupant = self._board.get(from[0], from[1]);
    self._board.set(to[0], to[1], occupant);
    self._board.set(from[0], from[1], occupants.EMPTY);

    if(jump) self._board.set(jump[0], jump[1], occupants.EMPTY);
}

Game.prototype.get_available_moves_from_stp = function(x, y) { // accepts an optional starting point for human user
    var self = this;
    var board = this._board;
    var startingPiece = board.get(x, y);
    var player, isKing;
    var availableDirections, availableMoves;

    if(startingPiece == occupants.EMPTY) return [];

    player = getPlayerFromPiece(startingPiece);

    debug("current player turn: ", self._turn);
    debug("player requested: ", player);
    if(player != self._turn) return [];

    isKing = startingPiece > occupants.P2;
    availableDirections = player == 1 ? [ directions.NE, directions.NW ] : [ directions.SE, directions.SW ];
    availableMoves = [];

    if(isKing) {
        availableDirections = [ directions.NE, directions.SE, directions.SW, directions.NW ];
    }
    
    // check distance 1
    for(var k = 0; k < availableDirections.length; k++) {
        var loc = board.getl(x, y, availableDirections[k], 1);
        var neighbor;
        var nplayer;

        if(loc) {
            debug("Board.get_available_moves_from_stp() : DEBUG : exploring ", loc);

            neighbor = board.get(loc[0], loc[1]);
            nplayer = getPlayerFromPiece(neighbor);

            debug("Board.get_available_moves_from_stp() : DEBUG : found ", neighbor);

            if(neighbor == occupants.EMPTY){
                availableMoves.push(new Move({
                    from : [x, y],
                    to : loc
                }));
            }
            else if(player != nplayer) {
                var oldloc = loc;
                loc = board.getl(x, y, availableDirections[k], 2);
                
                if(loc) {
                    neighbor = board.get(loc[0], loc[1]);

                    if(neighbor == occupants.EMPTY) {
                        availableMoves.push(new Move({
                            from : [x, y],
                            to : loc,
                            jump : oldloc,
                        }));
                    }
                }
            }
        }
    }

    debug("Board.get_available_moves_from_stp() : DEBUG : given ", { x : x, y : y });
    debug("Board.get_available_moves_from_stp() : DEBUG : got ", availableMoves);

    return availableMoves;
}

