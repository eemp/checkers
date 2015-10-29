var status_constants = require('../constants.js').game.status;
var turn_constants = require('../constants.js').game.turn;
var occupants = require('../constants.js').game.board.occupants;

var TIME_LIMIT = 5;

var MIN = 0;
var MAX = 1;

/* some utils functions */
var utils = require('./utils.js');
var getPlayerFromPiece = utils.getPlayerFromPiece;
var getRandomInt = utils.getRandomInt;
var transpositionTable = {};

function Player(details)
{
    this._best_move = null;
    this._turn = details.turn;
}

module.exports = Player;

var DEBUG_MODE = 0;
var enableTranspositionTable = 0;

Player.prototype.get_move = function(game) {
    // TODO: temporarily choose a random move
    if(DEBUG_MODE) {
        var moves = game.get_available_moves();
        return moves[getRandomInt(0, moves.length)];
    }

    this._best_move = null;
    
    
    var depth_to_search = 4;
    var start = process.hrtime(), elapsed;
    var timeout_flag = false;
    
    while(!timeout_flag) {
        this.minimax(game, depth_to_search, -1, 9999, true);
        depth_to_search++;

        elapsed = process.hrtime(start)[0];
        if(elapsed >= TIME_LIMIT/2) timeout_flag = true;
    }

    console.log("After searching ", depth_to_search - 1, " levels ",
            "in ", elapsed, " seconds into the search space, found: ", this._best_move);
    
    return this._best_move;
}

Player.prototype.minimax = function(game, d, alpha, beta, init_flag) {
    var self = this;
    var score;
    var ntype = game.turn() == self._turn ? MAX : MIN;
    var moves = game.get_available_moves();

    if(game.status() == status_constants.ENDED || d == 0) return this.evaluate(game);
    if(moves.length == 1 && init_flag) {
        this._best_move = moves[0];
        return;
    }

    if(ntype == MAX) {
        score = alpha;
        
        for(var k = 0; k < moves.length; k++) {
            var child = game.clone();
            var next_depth, chash, cscore;

            child.apply_move(moves[k]);
            next_depth = child.turn() == game.turn() ? d : d-1;
            chash = child.hash(next_depth);

            cscore = transpositionTable[chash] || self.minimax(child, next_depth, score, beta);
            if(enableTranspositionTable) transpositionTable[chash] = cscore;

            if(cscore >= score) {
                score = cscore;
                if(init_flag) this._best_move = moves[k];
            }
            
            if(score > beta) return beta;
        }
    }
    else if(ntype == MIN) {
        score = beta;
        for(var k = 0; k < moves.length; k++) {
            var child = game.clone();
            var next_depth, chash, cscore;

            child.apply_move(moves[k]);
            next_depth = child.turn() == game.turn() ? d : d-1;
            chash = child.hash(next_depth);

            cscore = transpositionTable[chash] || self.minimax(child, next_depth, alpha, score);
            if(enableTranspositionTable) transpositionTable[chash] = cscore;
            
            if(cscore <= score) {
                score = cscore;
                if(init_flag) this._best_move = moves[k];
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

