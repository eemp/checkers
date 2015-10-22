var status_constants = require('../constants.js').game.status;
var turn_constants = require('../constants.js').game.turn;
var occupants = require('../constants.js').game.board.occupants;

var DEPTH_LIMIT = 5;

var MIN = 0;
var MAX = 1;

/* some utils functions */
var utils = require('./utils.js');
var getPlayerFromPiece = utils.getPlayerFromPiece;
var getRandomInt = utils.getRandomInt;

function Player(details)
{
    this._best_move = null;
    this._turn = details.turn;
}

module.exports = Player;

var DEBUG_MODE = 0;
Player.prototype.get_move = function(game) {
    // TODO: temporarily choose a random move
    if(DEBUG_MODE) {
        var moves = game.get_available_moves();
        return moves[getRandomInt(0, moves.length)];
    }

    // TODO: time managment
    this._best_move = null;
    this.minimax(game, DEPTH_LIMIT, -1, 9999);
    console.log(this._best_move);    
    return this._best_move;
}

Player.prototype.minimax = function(game, d, alpha, beta) {
    var self = this;
    var score;
    var ntype = game.turn() == self._turn ? MAX : MIN;

    if(game.status() == status_constants.ENDED || d == 0) return this.evaluate(game);


    if(ntype == MAX) {
        score = alpha;
        var moves = game.get_available_moves();
        
        for(var k = 0; k < moves.length; k++) {
            var child = game.clone();
            var next_depth, cscore;

            child.apply_move(moves[k]);
            next_depth = child.turn() == game.turn() ? d : d-1;

            cscore = self.minimax(child, next_depth, score, beta);
            if(cscore > score) {
                score = cscore;
                if(d == DEPTH_LIMIT) this._best_move = moves[k]; // TODO: Can't do it based on this condition
            }
            
            if(score > beta) return beta;
        }
    }
    else if(ntype == MIN) {
        score = beta;
        var moves = game.get_available_moves();
        for(var k = 0; k < moves.length; k++) {
            var child = game.clone();
            var next_depth, cscore;

            child.apply_move(moves[k]);
            next_depth = child.turn() == game.turn() ? d : d-1;

            cscore = self.minimax(child, next_depth, alpha, score);
            if(cscore < score) {
                score = cscore;
                if(d == DEPTH_LIMIT) this._best_move = moves[k]; // TODO: Can't do it based on this condition
            }
            
            if(score < alpha) return alpha;
        }
    }

    return score;
}

// static evaluator / heuristic
Player.prototype.evaluate = function(game) {
    var board = game.board();
    var score = 0;
    for(var k = 0; k < 8; k++) {
        for(var l = 0; l < 8; l++) {
            var occupant = board[k][l];

            if(occupant == occupants.EMPTY) continue;

            var player = getPlayerFromPiece(occupant);
            var isKing = occupant > occupants.P2;
            var update = -1;

            if(player == this._turn) {
                update = 1;
            }
            
            score += update;
            if(isKing) score += update;
        }
    }

    return score > 0 ? score : 0;
}

