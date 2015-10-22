var constants = require('../constants.js');

module.exports = {
    getPlayerFromPiece : function (piece) {
        return (piece % 2 == 0 ? constants.game.turn.P2 : constants.game.turn.P1);
    },
    parseGameFileString : function(str) {
        var lines = str.split(/\r?\n/);
        var board = [];
        var turn;

        for(var k = 0; k < 8; k++){
            board.push(lines[k].trim().split(/\s+/));
        }
        turn = parseInt(lines[8], 10);

        return { board : board, turn : turn };
    },
    // Returns a random integer between min (included) and max (excluded)
    // Using Math.round() will give you a non-uniform distribution!
    getRandomInt : function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
}

