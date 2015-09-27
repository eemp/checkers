var constants = require('../constants.js').game.board;

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

function Board()
{
    this._board = get_empty_board();
    for(var k = 0; k < 8; k++) {
        for(var l = 0; l < 8; l++) {
            if(k % 2 != l % 2) this._board[k][l] = (
                k <= 2 ? constants.occupants.P1 : 
                    (k >= 5 ? constants.occupants.P2 : constants.occupants.EMPTY)
            );
        }
    }
}

module.exports = Board;

Board.prototype.set = function(x, y, p) {
    this._board[x][y] = p;
}

Board.prototype.data = function() {
    return this._board;
}

