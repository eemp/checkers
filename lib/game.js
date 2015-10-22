var constants = require('../constants.js').game;
var directions = constants.board.directions;
var occupants = constants.board.occupants;
var Board = require('./board.js');
var Move = require('./move.js');
var debug = require('debug')('checkers:lib:game');
var Player = require('./player.js');

/* some utils functions */
var utils = require('./utils.js');
var getPlayerFromPiece = utils.getPlayerFromPiece;

function Game(data)
{
    data = data || {};
    var boardData = data.board;
    var turn = data.turn;

    this._gameStatus = constants.status.STARTED;
    this._turn = turn || constants.turn.P1;
    this._board = new Board(boardData);
    this._turnCount = 0;
    this._next_moves = this.get_available_moves();
    this._jump_avail = this._next_moves.length && this._next_moves[0]._jump ? true : false;
    this._jump_again = false;
    this._jump_from_loc = null;
    this._P1 = data.P1 || new Player({turn : constants.turn.P1});
    this._P2 = data.P2 || new Player({turn : constants.turn.P2});
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

Game.prototype.boardObj = function() {
    return this._board;
}

Game.prototype.increment_turn = function() {
    this._turnCount++;
    this._turn = this._turn == constants.turn.P1 ? constants.turn.P2 : constants.turn.P1;
}

Game.prototype.turn = function() {
    return this._turn;
}

Game.prototype.getNextPlayersMove = function() {
    var self = this;
    var turn = self.turn();
    var move;

    if(turn == constants.turn.P1) move = self._P1.get_move(self);
    else move = self._P2.get_move(self);

    return move;
}

Game.prototype.apply_move = function(move_info) {
    var self = this;

    if(!move_info) return null;

    var from = move_info._from;
    var to = move_info._to;
    var jump = move_info._jump;
    var nextMoves, jumpAgain = false;
    var occupant = self._board.get(from[0], from[1]);
    
    this._jump_again = false;
    this._jump_from_loc = null;
    
    // king me
    if(to[1] == 7 && occupant == occupants.P1)
        occupant = occupants.P1K;
    else if(to[1] == 0 && occupant == occupants.P2)
        occupant = occupants.P2K;
    
    self._board.set(to[0], to[1], occupant);
    self._board.set(from[0], from[1], occupants.EMPTY);

    if(jump) {
        self._board.set(jump[0], jump[1], occupants.EMPTY);
        nextMoves = self.get_available_moves_from_stp(to[0], to[1]);
        if(nextMoves.length > 0 && nextMoves[0]._jump) {
            this._jump_again = true;
            this._jump_from_loc = to;
        }
    }
    
    if(!this._jump_again) {
        self.increment_turn();
        nextMoves = self.get_available_moves();
    }

    if(nextMoves.length && nextMoves[0]._jump)
        self._jump_avail = true;
    else
        self._jump_avail = false;

    this._next_moves = nextMoves;

    return nextMoves;
}

Game.prototype.get_available_moves = function() {
    var self = this;
    var board = this._board;
    var jumpFlag = false;
    var availableMoves;

    if(self._jump_from_loc) {
        var x = self._jump_from_loc[0],
            y = self._jump_from_loc[1];
        var piece = board.get(x, y);
        var player = getPlayerFromPiece(piece);
        
        if(player != self.turn()) availableMoves = [];
        else availableMoves = self.get_available_moves_from_stp(x, y);
    }
    else {
        availableMoves = [];
        for(var x = 0; x < 8; x++) {
            for(var y = 0; y < 8; y++) {
                var piece = board.get(x, y);
                var player = getPlayerFromPiece(piece);
    
                if(player != self.turn()) continue;

                var movesForPiece = self.get_available_moves_from_stp(x, y);
                if(movesForPiece.length > 0) {
                    if(!jumpFlag && movesForPiece[0]._jump) {
                        jumpFlag = true;
                        availableMoves.splice(0, availableMoves.length);
                    }
                
                    if(!jumpFlag || (jumpFlag && movesForPiece[0]._jump)) {
                        availableMoves = availableMoves.concat(movesForPiece);
                    }
                }
            }
        }
    }

    return availableMoves;
}

Game.prototype.get_available_moves_from_stp = function(x, y) { // accepts an optional starting point for human user
    var self = this;
    var board = this._board;
    var startingPiece = board.get(x, y);
    var player, isKing;
    var availableDirections;
    var availableMoves = [];
    var jumpFlag = false;

    if(startingPiece == occupants.EMPTY ||
        (this._jump_from_loc && (this._jump_from_loc[0] != x || this._jump_from_loc[1] != y))) return [];

    player = getPlayerFromPiece(startingPiece);

    if(player != self.turn()) return [];

    isKing = startingPiece > occupants.P2;
    availableDirections = player == 1 ? [ directions.SE, directions.SW ] : [ directions.NE, directions.NW ];

    if(isKing) {
        availableDirections = [ directions.NE, directions.SE, directions.SW, directions.NW ];
    }
    
    // check distance 1
    for(var k = 0; k < availableDirections.length; k++) {
        var loc = board.getl(x, y, availableDirections[k], 1);
        var neighbor;
        var nplayer;

        if(loc) {
            // debug("Board.get_available_moves_from_stp() : DEBUG : exploring ", loc);

            neighbor = board.get(loc[0], loc[1]);
            nplayer = getPlayerFromPiece(neighbor);

            // debug("Board.get_available_moves_from_stp() : DEBUG : found ", neighbor);

            if(neighbor == occupants.EMPTY){
                if(!jumpFlag) {
                    availableMoves.push(new Move({
                        from : [x, y],
                        to : loc
                    }));
                }
            }
            else if(player != nplayer) {
                var oldloc = loc;
                loc = board.getl(x, y, availableDirections[k], 2);
                
                if(loc) {
                    neighbor = board.get(loc[0], loc[1]);

                    if(!jumpFlag) {
                        jumpFlag = true;
                        availableMoves.splice(0, availableMoves.length);
                    }

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

    if(!jumpFlag && self._jump_avail) availableMoves.splice(0, availableMoves.length);

    // debug("Board.get_available_moves_from_stp() : DEBUG : given ", { x : x, y : y });
    // debug("Board.get_available_moves_from_stp() : DEBUG : got ", availableMoves);

    return availableMoves;
}

Game.prototype.hash = function() {
    return this.turn + ',' + this.board.hash();
}

Game.prototype.clone = function() {
    var self = this;
    var clone = Object.create(self);
    
    Object.keys(self).forEach(function(k) {
        clone[k] = self[k];
    });
    
    if(self['_jump_from_loc']) clone['_jump_from_loc'] = self['_jump_from_loc'].slice();
    clone['_board'] = self['_board'].clone();
    
    return clone;
}

