var constants = require('../constants.js').game.board;

function Board()
{
    this._board = [];
    for(var k = 0; k < 8; k++) {
        var occupant = constants.occupants.EMPTY;
        this._board.push([0, 0, 0, 0]);

        if(k <= 2) occupant = constants.occupants.P1;
        if(k >= 5) occupant = constants.occupants.P2;
        
        for(var l = 0; l < 4; l++) {
            this._board[k][l] = occupant;
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

