var debug = require('debug')('checkers:ai');
var game_debug = require('./debug.js');
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
    // TODO: temporarily don't allow AI vs AI
    // if(this._turn == 2) return null;
    
    // TODO: temporarily choose a random move
    if(DEBUG_MODE) {
        var moves = game.get_available_moves();
        return moves[getRandomInt(0, moves.length)];
    }

    this._best_move = null;
    
    var depth_to_search = 5;
    var start = process.hrtime(), elapsed;
    var timeout_flag = false;
    
    while(!timeout_flag) {
        var debug_obj = {children: []};
        this.minimax(game, depth_to_search, -Infinity, Infinity, debug_obj, true);
        // debug(JSON.stringify(debug_obj, null, 2));
        
        depth_to_search++;

        elapsed = process.hrtime(start)[0];
        if(elapsed >= TIME_LIMIT/2) timeout_flag = true;
        timeout_flag = true;
    }

    debug("After searching ", depth_to_search - 1, " levels ",
            "in ", elapsed, " seconds into the search space, found: ", this._best_move);
    
    return this._best_move;
}

Player.prototype.minimax = function(game, d, alpha, beta, debug_obj, init_flag) {
    var self = this;
    var v;
    var ntype = game.turn() == self._turn ? MAX : MIN;
    var moves = game.get_available_moves();

    if(game.status() == status_constants.ENDED || d == 0) return this.evaluate(game);
    if(moves.length == 1 && init_flag) {
        this._best_move = moves[0];
        return;
    }

    if(ntype == MAX) {
        v = -Infinity;
        
        for(var k = 0; k < moves.length; k++) {
            var child = game.clone();
            var cnode;
            var next_depth, chash, cv;

            child.apply_move(moves[k]);
            next_depth = child.turn() == game.turn() ? d : d-1;
            // chash = child.hash(next_depth);

            /*
            cnode = {
                move : game_debug.moveToString(moves[k]),
                board : game_debug.boardToString(child.board()),
                curr_eval : this.evaluate(child),
                type : 'MAX',
                alpha : alpha,
                beta : beta,
                score : null,
                depth : d,
                children : [],
            };
            */
            
            cv = self.minimax(child, next_depth, alpha, beta, cnode);
            // cnode.score = cv;
            
            if(cv >= v) {
                v = cv;
                if(init_flag) this._best_move = moves[k];
            }
            
            if(child.turn() != self._turn) alpha = v > alpha ? v : alpha;

            // debug_obj.children.push(cnode);

            if(alpha > beta) break;
        }

        return v;
    }
    else if(ntype == MIN) {
        v = Infinity;
        
        for(var k = 0; k < moves.length; k++) {
            var child = game.clone();
            var cnode;
            var next_depth, chash, cv;

            child.apply_move(moves[k]);
            next_depth = child.turn() == game.turn() ? d : d-1;
            // chash = child.hash(next_depth);

            /*
            cnode = {
                move : game_debug.moveToString(moves[k]),
                board : game_debug.boardToString(child.board()),
                curr_eval : this.evaluate(child),
                type : 'MIN',
                alpha : alpha,
                beta : beta,
                score : null,
                depth : d,
                children : [],
            };
            */
            
            cv = self.minimax(child, next_depth, alpha, beta, cnode);
            // cnode.score = cv;

            v = cv <= v ? cv : v;
            if(child.turn() == self._turn) beta = v < beta ? v : beta;
            
            // debug_obj.children.push(cnode);

            if(beta < alpha) break;
        }

        return v;
    }
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
            var update = player == this._turn ? 1 : -1;

            if(isKing) update *= 2;
            score += update;
        }
    }

    return score;
}

// utils
function repeat(str, times) {
    var repeated_str = '';
    for(var k = 0; k < times; k++) repeated_str = repeated_str + str;
    return repeated_str;
}

