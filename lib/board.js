var constants = require('../constants.js').game.board;
var directions = constants.directions;

function get_empty_board() {
    return [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ];
}

function Board(bdata)
{
    this._board = get_empty_board();
    
    if(bdata) {
        for(var k = 0; k < 8; k++) {
            for(var l = 0; l < 8; l++) {
                if(k % 2 != l % 2) this._board[k][l] = bdata[k][Math.floor(l/2)];
            }
        }
    }
    else {
        for(var k = 0; k < 8; k++) {
            for(var l = 0; l < 8; l++) {
                if(k % 2 != l % 2) this._board[k][l] = (
                    k <= 2 ? constants.occupants.P1 : 
                        (k >= 5 ? constants.occupants.P2 : constants.occupants.EMPTY)
                );
            }
        }
    }
}

module.exports = Board;

Board.prototype.get = function(x, y) {
    return this._board[y][x];
}

/* return the location given (x, y), direction d, distance dist */
Board.prototype.getl = function(x, y, d, dist) {
    var l = [x, y];
    if(d == directions.NE) {
        l[0] += dist;
        l[1] -= dist;
    }
    else if(d == directions.SE) {
        l[0] += dist;
        l[1] += dist;
    }
    else if(d == directions.SW) {
        l[0] -= dist;
        l[1] += dist;
    }
    else if(d == directions.NW) {
        l[0] -= dist;
        l[1] -= dist;
    }
    else {
        console.error("Board.getl() : ERR : unexpected direction provided."); 
        return null;
    }

    if(!(l[0] >= 0 && l[0] < 8) || !(l[1] >= 0 && l[1] < 8)) return null;

    return l;
}

Board.prototype.set = function(x, y, p) {
    this._board[y][x] = p;
    return this._board[y][x];
}

Board.prototype.data = function() {
    return this._board;
}

